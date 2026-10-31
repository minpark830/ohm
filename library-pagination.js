import {normalizeLibraryFilters} from './library-context.js?v=22c97c590ebdf290';

// Pagination changes only rendered rows. The full filtered selection continues
// to define problem navigation, recommendations and genuine progress counts.
export function libraryPageWindow(total,filters){
 if(!Number.isSafeInteger(total)||total<0)throw Error('Invalid library size.');
 const {page:requested,pageSize}=normalizeLibraryFilters(filters),pages=Math.max(1,Math.ceil(total/pageSize)),page=Math.min(requested,pages);
 const start=(page-1)*pageSize,end=Math.min(total,start+pageSize);
 return {page,pageSize,pages,start,end,total,from:total?start+1:0,hasPrevious:page>1,hasNext:page<pages};
}

export function libraryPagerMarkup(window){
 return `<nav class="library-pager" aria-label="Problem list pages"><p role="status" aria-live="polite">Showing <strong>${window.from}–${window.end}</strong> of ${window.total}</p><label for="library-page-size">Rows per page<select id="library-page-size">${[25,50,100].map(size=>`<option value="${size}" ${size===window.pageSize?'selected':''}>${size}</option>`).join('')}</select></label><div class="library-page-buttons"><button class="button" type="button" data-library-page="${window.page-1}" aria-label="Previous results page" ${window.hasPrevious?'':'disabled'}>←</button><span>Page ${window.page} of ${window.pages}</span><button class="button" type="button" data-library-page="${window.page+1}" aria-label="Next results page" ${window.hasNext?'':'disabled'}>→</button></div></nav>`;
}
