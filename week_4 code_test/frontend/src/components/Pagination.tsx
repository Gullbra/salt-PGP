import React from "react";
import { IPagination } from "../interfaces/interfaces";

import '../styles/styling.component.Pagination.css'

interface IPaginationComponent{
  pageState: IPagination
  pageStateHandler: (input: {
    page?: number;
    filters?: string[];
  }) => void
}

const Pagination = ({ pageState, pageStateHandler }: IPaginationComponent) => {
  return (
    <>
      {pageState.maxPages && (
        <section className="main__pageState-section">
          <div>
            {pageState.page > 1 && <button onClick={() => pageStateHandler({page: pageState.page-1})} type="button" className="pageState-btn">{"< prev"}</button>}
          </div>

          <div>
            {pageState.page > 3 && <button onClick={() => pageStateHandler({page: 1})} type="button" className="pageState-btn">{"1"}</button>}
            {pageState.page > 4 && <button className="pageState-btn">...</button>}
            {pageState.page > 2 && <button onClick={() => pageStateHandler({page: pageState.page-2})} type="button" className="pageState-btn">{`${pageState.page-2}`}</button>}
            {pageState.page > 1 && <button onClick={() => pageStateHandler({page: pageState.page-1})} type="button" className="pageState-btn">{`${pageState.page-1}`}</button>}
            <button type="button" className="pageState-btn current-page">{pageState.page}</button>
            {pageState.maxPages - pageState.page >= 1 && <button onClick={() => pageStateHandler({page: pageState.page+1})} type="button" className="pageState-btn">{`${pageState.page+1}`}</button>}
            {pageState.maxPages - pageState.page >= 2 && <button onClick={() => pageStateHandler({page: pageState.page+2})} type="button" className="pageState-btn">{`${pageState.page+2}`}</button>}
            {pageState.maxPages - pageState.page >= 4 && <button className="pageState-btn">...</button>}
            {pageState.maxPages - pageState.page >= 3 && <button onClick={() => pageStateHandler({page: pageState.maxPages || 1})} type="button" className="pageState-btn">{`${pageState.maxPages || 1}`}</button>}
          </div>

          <div>
            {pageState.page < pageState.maxPages && <button onClick={() => pageStateHandler({page: pageState.page+1})} type="button" className="pageState-btn">{"next >"}</button>}
          </div>
        </section>
      )}
    </>
  )
}

export default Pagination