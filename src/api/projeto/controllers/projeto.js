'use strict';

/**
 * projeto controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController(
  'api::projeto.projeto',
  ({ strapi }) => ({
    async getPlusInfo(ctx) {
      const findAllProjetos = async (ctx, page = 1, projetos = []) => {
        ctx.query = {
          pagination: {
            page,
            pageSize: '100'
          }
        }

        const result = await super.find(ctx) 

        if (result.meta.pagination.pageCount > page) {
          return findAllProjetos(ctx, page + 1, [...projetos, ...result.data])
        }

        result.data = [
          ...projetos,
          ...result.data,
        ]
        return result
      }

      const findNextAndPrev = (projetos, slug) => {
        const slugs = projetos.data.map(item => item.attributes.slug)
        const indexOf = projetos.data.map(item => item.attributes.slug).indexOf(slug)
        const prev = indexOf != 0 && slugs[indexOf - 1]
        const next = indexOf != projetos.data.length - 1 && slugs[indexOf + 1]
        return {
          prev,
          next
        }
      }

      const handleFindProjeto = (projeto, prevAndNext) => {
        const result = {
          data: projeto.data[0],
          meta: {
            ...projeto.meta,
            ...prevAndNext
          }
        }

        return result
      }

      ctx.query = {
        populate: 'banner',
        filters: {
          slug: {
            '$eq': ctx.params.slug
          }
        }
      }

      const projeto = await super.find(ctx)

      if (!projeto.data.length) return projeto

      const projetos = await findAllProjetos(ctx)

      const prevAndNext = findNextAndPrev(projetos, ctx.params.slug)

      const result = handleFindProjeto(projeto, prevAndNext)
    
      return result
    }
  })
);
