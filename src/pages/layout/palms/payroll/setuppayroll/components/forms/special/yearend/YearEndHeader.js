import React from "react";
import { formatTwoDateToText } from "../../../../../../../customstring/CustomString";
export const YearEndHeader = ({selectedOffice,year,empStatus,signatories})=>{
    return (
        <header>
            <section className="flex-column-center">
                <span><b>Republic of the Philippines</b></span>
                <span><b>Butuan City</b></span>
                <span><b>{selectedOffice?.dept_title}</b></span>
                <span><b>{selectedOffice?.short_name} - {empStatus}</b></span>
                <span><b>YEAR END AND CASH GIFT {year}</b></span>
            </section>
            <br />
            <section>
                <span>
                We hereby acknowledge to have received from {signatories?signatories.treasury.name.toUpperCase():''},
                City Treasurer of Butuan City the sums herein specified opposite our
                respective names, the same, being full compensation for our services
                rendered during the period stated below to the correctness of which we
                hereby severally certify.
                </span>
            </section>
        </header>
    )
}