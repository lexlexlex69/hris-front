import React from "react";
export const JOFooter = ({signatories})=>{
    return (
        <div>
        <footer>
            <section>
                <div>
                    <span>(1) I hereby CERTIFY on my OFFICIAL OATH that the above payroll is
                        CORRECT, and that the services above stated have been duly RENDERED.
                        Payment for such service(s) is also hereby APPROVED from the
                        appropriation indicated.
                    </span>
                </div>
                <div className="flex-center">
                    <div>
                        <span><b>{signatories?signatories.dept_head.name.toUpperCase():''}</b></span>
                    </div>
                    <div>
                        <span><i> {signatories?signatories.dept_head.position:''} </i></span>
                    </div>
                </div>
            </section>
            <section>
                <div>
                <span>(2) APPROVED subject to pre-audit:</span>
                </div>
                <div className="flex-center">
                <div>
                    <span><b> {signatories?signatories.accounting.name.toUpperCase():''} </b></span>
                </div>
                <div>
                    <span><i> {signatories?signatories.accounting.position:''} </i></span>
                </div>
                </div>
            </section>
            <section>
                <div>
                <span>(3) CASH AVAILABILITY:</span>
                </div>
                <div className="flex-center">
                <div>
                    <span><b>{signatories?signatories.treasury.name.toUpperCase():''}</b></span>
                </div>
                <div>
                    <span><i>{signatories?signatories.treasury.position:''}</i></span>
                </div>
                </div>
            </section>
            <section>
                <div>
                <span>(4) APPROVED:</span>
                </div>
                <div className="flex-center">
                <div>
                    <span><b>{signatories?signatories.cmo.name.toUpperCase():''}</b></span>
                </div>
                <div>
                    <span><i>{signatories?signatories.cmo.position:''}</i></span>
                </div>
                </div>
            </section>
            <section>
                <div>
                <span>
                    (5) I hereby CERTIFY on my official oath that each employee whose
                    name appear on the above roll has been paid in cash or in check, and
                    in no other mode, the amount shown under the number opposite his/her
                    name. The total of the payments made by means of this payroll amount
                    to
                </span>
                <div>
                    <span>
                    <i> (P_______________) pesos only. </i>
                    </span>
                </div>
                </div>
                <div className="flex-end">
                <div>
                    <div className="under-line" style={{'width': '18rem'}}>&nbsp;</div>
                    <div className="flex-center">
                    <span><i>Cash Disbursing Officer</i></span>
                    </div>
                </div>
                </div>
            </section>
        </footer>
        </div>
    )
}