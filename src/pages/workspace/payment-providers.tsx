// Keep page composition editable; interaction belongs in the shared components.
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { WorkspaceLink } from "@/components/overtrue/workspace/primitives"
export default function Page() {
  return (
    <div data-workspace-page="payment-providers" className="pn-page-wrapper">
      {" "}
      <div className={"pn-page-header pn-d-print-none"}>
        {" "}
        <div className={"pn-container-xl"}>
          {" "}
          <div className={"pn-row pn-g-2 pn-align-items-center"}>
            {" "}
            <div className={"pn-col"}>
              {" "}
              <h1 className={"pn-page-title"}>{"Payment Providers"}</h1>{" "}
            </div>{" "}
            <div className={"pn-col-auto pn-ms-auto pn-d-print-none"}>
              {" "}
              <WorkspaceLink
                href={"/docs"}
                target={"_blank"}
                rel={"noopener"}
                className={"pn-link-secondary"}
              >
                {" Docs "}{" "}
                <svg
                  xmlns={"http://www.w3.org/2000/svg"}
                  width={"24"}
                  height={"24"}
                  viewBox={"0 0 24 24"}
                  fill={"none"}
                  stroke={"currentColor"}
                  strokeWidth={"2"}
                  strokeLinecap={"round"}
                  strokeLinejoin={"round"}
                  aria-hidden={"true"}
                  focusable={"false"}
                  className={"pn-icon pn-icon-sm"}
                >
                  {" "}
                  <path
                    d={
                      "M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6"
                    }
                  ></path>{" "}
                  <path d={"M11 13l9 -9"}></path>{" "}
                  <path d={"M15 4h5v5"}></path>{" "}
                </svg>{" "}
              </WorkspaceLink>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      <div id={"content"} className={"pn-page-body"}>
        {" "}
        <div className={"pn-container-xl"}>
          {" "}
          <div className={"pn-row pn-row-cards"}>
            {" "}
            <div className={"pn-col-12"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardHeader className={"pn-card-header"}>
                  {" "}
                  <div>
                    {" "}
                    <CardTitle className={"pn-card-title"}>
                      {"Light version"}
                    </CardTitle>{" "}
                    <CardDescription className={"pn-card-subtitle"}>
                      {
                        "Provider logos on a light background, for use on white or light cards."
                      }
                    </CardDescription>{" "}
                  </div>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <div className={"pn-row pn-g-5 pn-row-cols-5"}>
                    {" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-2c2p"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>{"2c2p"}</strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"2c2p"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-2checkout"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"2checkout"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"2checkout"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-ach-transfer"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"ACH Transfer"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"ach-transfer"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-adyen"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Adyen"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"adyen"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-affirm"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Affirm"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"affirm"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-afterpay"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Afterpay"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"afterpay"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-airtm"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Airtm"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"airtm"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-airwallex"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Airwallex"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"airwallex"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-alipay-plus"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Alipay Plus"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"alipay-plus"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-alipay"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Alipay"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"alipay"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-allegro-pay"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Allegro Pay"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"allegro-pay"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-amazon-pay"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Amazon Pay"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"amazon-pay"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-amazon"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Amazon"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"amazon"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-americanexpress"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"American Express"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"americanexpress"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-ant-group"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Ant Group"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"ant-group"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-applepay"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Apple Pay"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"applepay"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-authorize"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Authorize"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"authorize"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-autopay"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Autopay"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"autopay"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-bancontact"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Bancontact"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"bancontact"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-bank-of-america"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Bank of America"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"bank-of-america"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-barclays"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Barclays"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"barclays"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-bbva"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>{"BBVA"}</strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"bbva"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-binance-usd"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Binance USD"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"binance-usd"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-binance"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Binance"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"binance"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-bitcoin"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Bitcoin"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"bitcoin"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-bitpay"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"BitPay"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"bitpay"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-bkash"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Bkash"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"bkash"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-blik"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>{"Blik"}</strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"blik"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-bnb-chain"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"BNB Chain"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"bnb-chain"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-bnp-paribas"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"BNP Paribas"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"bnp-paribas"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-braintree"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Braintree"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"braintree"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-brex"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>{"Brex"}</strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"brex"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-capital-one"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Capital One"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"capital-one"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-cash-app"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Cash App"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"cash-app"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-chase"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Chase"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"chase"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-checkout-com"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Checkout.com"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"checkout-com"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-chime"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Chime"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"chime"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-china-construction-bank"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"China Construction Bank"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"china-construction-bank"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-cirrus"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Cirrus"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"cirrus"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-citi"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>{"Citi"}</strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"citi"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-coinbase"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Coinbase"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"coinbase"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-coinkite"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Coinkite"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"coinkite"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-crypto-com"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Crypto.com"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"crypto-com"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-deutsche-bank"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Deutsche Bank"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"deutsche-bank"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-dinersclub"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Diners Club"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"dinersclub"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-directdebit"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Direct Debit"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"directdebit"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-discover"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Discover"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"discover"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-dwolla"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Dwolla"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"dwolla"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-easypaisa"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"EasyPaisa"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"easypaisa"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-ebay"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>{"eBay"}</strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"ebay"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-elo"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>{"Elo"}</strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"elo"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-epayco"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"ePayco"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"epayco"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-esewa"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"eSewa"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"esewa"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-ethereum"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Ethereum"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"ethereum"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-eway"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>{"eWay"}</strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"eway"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-fifth-third-bank"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Fifth Third Bank"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"fifth-third-bank"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-fiserv"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Fiserv"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"fiserv"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-flutterwave"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Flutterwave"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"flutterwave"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-fonepay"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"FonePay"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"fonepay"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-gcash"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"GCash"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"gcash"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-giropay"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Giropay"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"giropay"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-goldman-sachs"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Goldman Sachs"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"goldman-sachs"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-google-pay"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Google Pay"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"google-pay"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-googlewallet"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Google Wallet"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"googlewallet"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-grabpay"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"GrabPay"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"grabpay"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-hsbc"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>{"HSBC"}</strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"hsbc"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-hubspot"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"HubSpot"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"hubspot"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-huntington-bank"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Huntington Bank"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"huntington-bank"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-icbc"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>{"ICBC"}</strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"icbc"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-ideal"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"iDeal"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"ideal"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-imepay"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"IMEPay"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"imepay"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-imoje"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"imoje (ING Pay)"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"imoje"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-ing"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>{"ING"}</strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"ing"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-ingenico"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Ingenico"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"ingenico"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-interac"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Interac"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"interac"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-jazzcash"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"JazzCash"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"jazzcash"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-jcb"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>{"JCB"}</strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"jcb"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-khalti"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Khalti"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"khalti"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-klarna"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Klarna"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"klarna"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-kraken"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Kraken"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"kraken"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-linepay"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"LINE Pay"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"linepay"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-litecoin"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Litecoin"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"litecoin"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-mada"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>{"Mada"}</strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"mada"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-maestro"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Maestro"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"maestro"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-mastercard"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Mastercard"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"mastercard"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-mercado-pago"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Mercado Pago"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"mercado-pago"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-mercury"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Mercury"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"mercury"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-meta-pay"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Meta Pay"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"meta-pay"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-metamask"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"MetaMask"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"metamask"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-mir"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>{"MIR"}</strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"mir"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-mitsubishi-ufj"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Mitsubishi UFJ"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"mitsubishi-ufj"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-mobilepay"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"MobilePay"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"mobilepay"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-mollie"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Mollie"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"mollie"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-monero"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Monero"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"monero"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-moneygram"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"MoneyGram"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"moneygram"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-mpesa"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"M-Pesa"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"mpesa"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-ncr"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>{"NCR"}</strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"ncr"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-neteller"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Neteller"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"neteller"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-northone"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"NorthOne"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"northone"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-nu"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Nubank"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"nu"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-nuvei"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Nuvei"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"nuvei"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-opensea"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"OpenSea"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"opensea"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-oxxo"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>{"OXXO"}</strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"oxxo"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-paybox"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Paybox"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"paybox"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-payconiq"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Payconiq"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"payconiq"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-payka"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Payka"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"payka"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-payline"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Payline"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"payline"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-paynow"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Paynow"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"paynow"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-payone"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Payone"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"payone"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-payoneer"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Payoneer"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"payoneer"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-paypal"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"PayPal"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"paypal"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-paypay"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"PayPay"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"paypay"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-paypo"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"PayPo"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"paypo"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-paysafe"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Paysafe"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"paysafe"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-paysafecard"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Paysafecard"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"paysafecard"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-paystack"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Paystack"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"paystack"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-paytm"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Paytm"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"paytm"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-payu"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>{"PayU"}</strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"payu"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-phonepe"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"PhonePe"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"phonepe"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-pix"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>{"Pix"}</strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"pix"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-pnc-bank"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"PNC Bank"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"pnc-bank"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-poli"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>{"Poli"}</strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"poli"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-przelewy24"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Przelewy24"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"przelewy24"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-rapyd"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Rapyd"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"rapyd"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-razorpay"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Razorpay"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"razorpay"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-revolut-pay"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Revolut Pay"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"revolut-pay"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-ripple"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Ripple"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"ripple"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-rupay"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"RuPay"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"rupay"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-samsung-pay"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Samsung Pay"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"samsung-pay"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-santander"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Santander"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"santander"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-sepa"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>{"SEPA"}</strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"sepa"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-shop-pay"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Shop Pay"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"shop-pay"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-shopify"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Shopify"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"shopify"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-skrill"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Skrill"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"skrill"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-skycash"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"SkyCash"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"skycash"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-sofort"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Sofort"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"sofort"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-solana"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Solana"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"solana"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-spingo"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Spingo"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"spingo"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-square"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Square"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"square"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-stax"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>{"Stax"}</strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"stax"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-stcpay"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"STC Pay"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"stcpay"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-stripe"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Stripe"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"stripe"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-sumitomo-mitsui"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Sumitomo Mitsui"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"sumitomo-mitsui"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-swift"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"SWIFT"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"swift"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-swish"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Swish"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"swish"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-synchrony"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Synchrony"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"synchrony"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-tether"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Tether"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"tether"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-tpay"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>{"Tpay"}</strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"tpay"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-troy"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>{"Troy"}</strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"troy"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-true-usd"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"True USD"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"true-usd"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-trustly"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Trustly"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"trustly"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-twint"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Twint"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"twint"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-ubs"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>{"UBS"}</strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"ubs"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-unionpay"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"UnionPay"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"unionpay"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-upi"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>{"UPI"}</strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"upi"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-us-bank"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"U.S. Bank"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"us-bank"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-usdc"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>{"USDC"}</strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"usdc"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-venmo"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Venmo"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"venmo"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-verifone"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Verifone"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"verifone"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-vipps"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Vipps"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"vipps"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-visa"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>{"Visa"}</strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"visa"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-we-chat-pay"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"WeChat Pay"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"we-chat-pay"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-webmoney"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"WebMoney"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"webmoney"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-wells-fargo"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Wells Fargo"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"wells-fargo"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-westernunion"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Western Union"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"westernunion"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-wire-transfer"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Wire Transfer"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"wire-transfer"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-wise"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>{"Wise"}</strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"wise"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-worldpay"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Worldpay"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"worldpay"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-zelle"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Zelle"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"zelle"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
            <div className={"pn-col-12"}>
              {" "}
              <Card className={"pn-card"}>
                {" "}
                <CardHeader className={"pn-card-header"}>
                  {" "}
                  <div>
                    {" "}
                    <CardTitle className={"pn-card-title"}>
                      {"Dark version"}
                    </CardTitle>{" "}
                    <CardDescription className={"pn-card-subtitle"}>
                      {
                        "Provider logos with an inverted color scheme, for dark backgrounds."
                      }
                    </CardDescription>{" "}
                  </div>{" "}
                </CardHeader>{" "}
                <CardContent className={"pn-card-body"}>
                  {" "}
                  <div className={"pn-row pn-g-5 pn-row-cols-5"}>
                    {" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-2c2p-dark"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>{"2c2p"}</strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"2c2p-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-2checkout-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"2checkout"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"2checkout-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-ach-transfer-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"ACH Transfer"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"ach-transfer-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-adyen-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Adyen"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"adyen-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-affirm-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Affirm"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"affirm-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-afterpay-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Afterpay"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"afterpay-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-airtm-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Airtm"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"airtm-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-airwallex-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Airwallex"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"airwallex-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-alipay-plus-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Alipay Plus"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"alipay-plus-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-alipay-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Alipay"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"alipay-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-allegro-pay-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Allegro Pay"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"allegro-pay-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-amazon-pay-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Amazon Pay"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"amazon-pay-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-amazon-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Amazon"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"amazon-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-americanexpress-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"American Express"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"americanexpress-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-ant-group-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Ant Group"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"ant-group-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-applepay-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Apple Pay"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"applepay-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-authorize-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Authorize"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"authorize-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-autopay-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Autopay"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"autopay-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-bancontact-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Bancontact"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"bancontact-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-bank-of-america-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Bank of America"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"bank-of-america-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-barclays-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Barclays"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"barclays-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-bbva-dark"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>{"BBVA"}</strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"bbva-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-binance-usd-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Binance USD"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"binance-usd-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-binance-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Binance"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"binance-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-bitcoin-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Bitcoin"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"bitcoin-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-bitpay-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"BitPay"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"bitpay-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-bkash-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Bkash"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"bkash-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-blik-dark"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>{"Blik"}</strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"blik-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-bnb-chain-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"BNB Chain"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"bnb-chain-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-bnp-paribas-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"BNP Paribas"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"bnp-paribas-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-braintree-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Braintree"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"braintree-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-brex-dark"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>{"Brex"}</strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"brex-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-capital-one-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Capital One"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"capital-one-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-cash-app-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Cash App"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"cash-app-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-chase-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Chase"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"chase-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-checkout-com-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Checkout.com"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"checkout-com-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-chime-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Chime"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"chime-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-china-construction-bank-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"China Construction Bank"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"china-construction-bank-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-cirrus-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Cirrus"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"cirrus-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-citi-dark"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>{"Citi"}</strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"citi-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-coinbase-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Coinbase"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"coinbase-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-coinkite-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Coinkite"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"coinkite-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-crypto-com-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Crypto.com"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"crypto-com-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-deutsche-bank-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Deutsche Bank"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"deutsche-bank-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-dinersclub-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Diners Club"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"dinersclub-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-directdebit-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Direct Debit"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"directdebit-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-discover-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Discover"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"discover-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-dwolla-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Dwolla"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"dwolla-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-easypaisa-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"EasyPaisa"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"easypaisa-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-ebay-dark"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>{"eBay"}</strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"ebay-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-elo-dark"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>{"Elo"}</strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"elo-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-epayco-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"ePayco"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"epayco-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-esewa-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"eSewa"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"esewa-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-ethereum-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Ethereum"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"ethereum-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-eway-dark"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>{"eWay"}</strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"eway-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-fifth-third-bank-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Fifth Third Bank"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"fifth-third-bank-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-fiserv-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Fiserv"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"fiserv-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-flutterwave-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Flutterwave"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"flutterwave-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-fonepay-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"FonePay"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"fonepay-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-gcash-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"GCash"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"gcash-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-giropay-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Giropay"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"giropay-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-goldman-sachs-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Goldman Sachs"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"goldman-sachs-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-google-pay-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Google Pay"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"google-pay-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-googlewallet-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Google Wallet"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"googlewallet-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-grabpay-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"GrabPay"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"grabpay-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-hsbc-dark"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>{"HSBC"}</strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"hsbc-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-hubspot-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"HubSpot"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"hubspot-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-huntington-bank-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Huntington Bank"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"huntington-bank-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-icbc-dark"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>{"ICBC"}</strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"icbc-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-ideal-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"iDeal"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"ideal-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-imepay-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"IMEPay"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"imepay-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-imoje-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"imoje (ING Pay)"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"imoje-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-ing-dark"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>{"ING"}</strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"ing-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-ingenico-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Ingenico"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"ingenico-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-interac-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Interac"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"interac-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-jazzcash-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"JazzCash"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"jazzcash-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-jcb-dark"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>{"JCB"}</strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"jcb-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-khalti-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Khalti"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"khalti-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-klarna-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Klarna"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"klarna-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-kraken-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Kraken"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"kraken-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-linepay-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"LINE Pay"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"linepay-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-litecoin-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Litecoin"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"litecoin-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-mada-dark"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>{"Mada"}</strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"mada-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-maestro-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Maestro"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"maestro-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-mastercard-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Mastercard"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"mastercard-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-mercado-pago-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Mercado Pago"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"mercado-pago-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-mercury-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Mercury"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"mercury-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-meta-pay-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Meta Pay"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"meta-pay-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-metamask-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"MetaMask"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"metamask-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-mir-dark"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>{"MIR"}</strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"mir-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-mitsubishi-ufj-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Mitsubishi UFJ"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"mitsubishi-ufj-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-mobilepay-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"MobilePay"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"mobilepay-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-mollie-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Mollie"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"mollie-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-monero-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Monero"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"monero-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-moneygram-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"MoneyGram"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"moneygram-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-mpesa-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"M-Pesa"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"mpesa-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-ncr-dark"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>{"NCR"}</strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"ncr-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-neteller-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Neteller"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"neteller-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-northone-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"NorthOne"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"northone-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-nu-dark"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Nubank"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"nu-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-nuvei-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Nuvei"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"nuvei-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-opensea-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"OpenSea"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"opensea-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-oxxo-dark"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>{"OXXO"}</strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"oxxo-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-paybox-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Paybox"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"paybox-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-payconiq-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Payconiq"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"payconiq-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-payka-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Payka"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"payka-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-payline-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Payline"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"payline-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-paynow-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Paynow"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"paynow-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-payone-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Payone"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"payone-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-payoneer-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Payoneer"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"payoneer-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-paypal-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"PayPal"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"paypal-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-paypay-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"PayPay"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"paypay-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-paypo-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"PayPo"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"paypo-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-paysafe-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Paysafe"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"paysafe-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-paysafecard-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Paysafecard"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"paysafecard-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-paystack-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Paystack"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"paystack-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-paytm-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Paytm"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"paytm-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-payu-dark"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>{"PayU"}</strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"payu-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-phonepe-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"PhonePe"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"phonepe-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-pix-dark"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>{"Pix"}</strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"pix-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-pnc-bank-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"PNC Bank"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"pnc-bank-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-poli-dark"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>{"Poli"}</strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"poli-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-przelewy24-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Przelewy24"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"przelewy24-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-rapyd-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Rapyd"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"rapyd-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-razorpay-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Razorpay"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"razorpay-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-revolut-pay-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Revolut Pay"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"revolut-pay-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-ripple-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Ripple"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"ripple-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-rupay-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"RuPay"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"rupay-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-samsung-pay-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Samsung Pay"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"samsung-pay-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-santander-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Santander"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"santander-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-sepa-dark"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>{"SEPA"}</strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"sepa-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-shop-pay-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Shop Pay"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"shop-pay-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-shopify-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Shopify"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"shopify-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-skrill-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Skrill"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"skrill-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-skycash-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"SkyCash"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"skycash-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-sofort-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Sofort"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"sofort-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-solana-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Solana"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"solana-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-spingo-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Spingo"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"spingo-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-square-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Square"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"square-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-stax-dark"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>{"Stax"}</strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"stax-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-stcpay-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"STC Pay"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"stcpay-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-stripe-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Stripe"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"stripe-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-sumitomo-mitsui-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Sumitomo Mitsui"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"sumitomo-mitsui-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-swift-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"SWIFT"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"swift-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-swish-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Swish"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"swish-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-synchrony-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Synchrony"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"synchrony-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-tether-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Tether"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"tether-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-tpay-dark"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>{"Tpay"}</strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"tpay-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-troy-dark"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>{"Troy"}</strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"troy-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-true-usd-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"True USD"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"true-usd-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-trustly-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Trustly"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"trustly-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-twint-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Twint"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"twint-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-ubs-dark"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>{"UBS"}</strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"ubs-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-unionpay-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"UnionPay"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"unionpay-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-upi-dark"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>{"UPI"}</strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"upi-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-us-bank-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"U.S. Bank"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"us-bank-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-usdc-dark"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>{"USDC"}</strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"usdc-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-venmo-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Venmo"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"venmo-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-verifone-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Verifone"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"verifone-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-vipps-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Vipps"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"vipps-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-visa-dark"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>{"Visa"}</strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"visa-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-we-chat-pay-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"WeChat Pay"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"we-chat-pay-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-webmoney-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"WebMoney"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"webmoney-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-wells-fargo-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Wells Fargo"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"wells-fargo-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-westernunion-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Western Union"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"westernunion-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-wire-transfer-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Wire Transfer"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"wire-transfer-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={"pn-payment pn-payment-provider-wise-dark"}
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>{"Wise"}</strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"wise-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-worldpay-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Worldpay"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"worldpay-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <span
                            className={
                              "pn-payment pn-payment-provider-zelle-dark"
                            }
                          ></span>{" "}
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <strong className={"pn-d-block"}>
                            {"Zelle"}
                          </strong>{" "}
                          <div className={"pn-mt-1"}>
                            {" "}
                            <code>{"zelle-dark"}</code>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  )
}
