import {
  WorkspaceDatepicker,
  WorkspaceRange,
} from "@/components/overtrue/workspace/plugins";
// Keep page composition editable; interaction belongs in the shared components.
import { useState, type CSSProperties } from "react";
import { IconArrowUpRight } from "@tabler/icons-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  WorkspaceButton,
  WorkspaceDropdown,
  WorkspaceDropdownContent,
  WorkspaceDropdownItem,
  WorkspaceDropdownTrigger,
  WorkspaceForm,
  WorkspaceInput,
  WorkspaceLink,
  WorkspaceSelect,
  WorkspaceTextarea,
} from "@/components/overtrue/workspace/primitives";

const categories = [
  ["basics", "Text & fields"],
  ["selects", "Select & search"],
  ["choices", "Choices & switches"],
  ["visual", "Visual choices"],
  ["groups", "Input groups"],
  ["special", "Dates & files"],
  ["feedback", "States & actions"],
  ["compositions", "Complete forms"],
] as const;
export default function Page() {
  const [category, setCategory] = useState<string>("basics");
  return (
    <div
      data-workspace-page="form-elements"
      className="pn-page-wrapper form-workbench"
    >
      <div className="pn-container-xl">
        <header className="form-workbench-heading">
          <div>
            <p className="form-workbench-eyebrow">Component library / Forms</p>
            <h1>Form elements</h1>
            <p>
              Thoughtful inputs for everyday work. Explore a pattern, then make
              it your own.
            </p>
          </div>
          <WorkspaceLink href="/docs" className="form-workbench-docs">
            Documentation <IconArrowUpRight size={16} />
          </WorkspaceLink>
        </header>
        <nav className="form-workbench-nav" aria-label="Form categories">
          {categories.map(([id, label]) => (
            <button
              key={id}
              type="button"
              aria-pressed={category === id}
              aria-controls={"form-category-" + id}
              onClick={() => setCategory(id)}
            >
              {label}
            </button>
          ))}
        </nav>
        <div id="content">
          <section
            id="form-category-basics"
            className="form-workbench-section"
            hidden={category !== "basics"}
            aria-labelledby="form-title-basics"
          >
            <div className="form-workbench-section-heading">
              <div>
                <h2 id="form-title-basics">Start with the essentials</h2>
                <p>
                  Text fields, longer answers, and the states that make a form
                  clear.
                </p>
              </div>
              <span>11 examples</span>
            </div>
            <WorkspaceForm className="pn-card form-workbench-card">
              <CardContent className="pn-card-body form-workbench-fields">
                <div className="form-workbench-example">
                  <div className={"pn-mb-3"}>
                    {" "}
                    <label className={"pn-form-label"} htmlFor={"fe1-text"}>
                      {" Text "}
                    </label>{" "}
                    <WorkspaceInput
                      type={"text"}
                      className={"pn-form-control"}
                      id={"fe1-text"}
                      name={"example-text-input"}
                      placeholder={"Input placeholder"}
                    />{" "}
                  </div>
                </div>
                <div className="form-workbench-example">
                  <div className={"pn-mb-3"}>
                    {" "}
                    <label className={"pn-form-label"} htmlFor={"fe1-password"}>
                      {" Password "}
                    </label>{" "}
                    <WorkspaceInput
                      type={"password"}
                      className={"pn-form-control"}
                      id={"fe1-password"}
                      name={"example-password-input"}
                      placeholder={"Input placeholder"}
                    />{" "}
                  </div>
                </div>
                <div className="form-workbench-example">
                  <div className={"pn-mb-3"}>
                    {" "}
                    <label
                      className={"pn-form-label pn-required"}
                      htmlFor={"fe1-required"}
                    >
                      {" Required "}
                      <span className={"pn-visually-hidden"}>
                        {" (required)"}
                      </span>{" "}
                    </label>{" "}
                    <WorkspaceInput
                      type={"text"}
                      className={"pn-form-control"}
                      id={"fe1-required"}
                      name={"example-required-input"}
                      placeholder={"Required..."}
                      aria-required={"true"}
                    />{" "}
                  </div>
                </div>
                <div className="form-workbench-example">
                  <div className={"pn-mb-3"}>
                    {" "}
                    <div className={"pn-form-label"}>{"Static"}</div>{" "}
                    <div className={"pn-form-control-plaintext"}>
                      {"Input value"}
                    </div>{" "}
                  </div>
                </div>
                <div className="form-workbench-example">
                  <div className={"pn-mb-3"}>
                    {" "}
                    <label className={"pn-form-label"} htmlFor={"fe1-textarea"}>
                      {" Textarea "}
                    </label>{" "}
                    <WorkspaceTextarea
                      className={"pn-form-control"}
                      id={"fe1-textarea"}
                      name={"example-textarea-input"}
                      rows={6}
                      placeholder={"Content.."}
                      defaultValue={
                        "A shared space for project notes, updates, and next steps."
                      }
                    />{" "}
                  </div>
                </div>
                <div className="form-workbench-example">
                  <div className={"pn-mb-3"}>
                    {" "}
                    <label
                      className={"pn-form-label"}
                      htmlFor={"fe5-textarea-autosize"}
                    >
                      {" Autosize textarea "}
                    </label>{" "}
                    <WorkspaceTextarea
                      className={"pn-form-control"}
                      id={"fe5-textarea-autosize"}
                      placeholder={"Type something…"}
                      defaultValue={""}
                    />{" "}
                  </div>
                </div>
                <div className="form-workbench-example">
                  <div className={"pn-mb-3"}>
                    {" "}
                    <label className={"pn-form-label"} htmlFor={"fe1-disabled"}>
                      {" Disabled "}
                    </label>{" "}
                    <WorkspaceInput
                      type={"text"}
                      className={"pn-form-control"}
                      id={"fe1-disabled"}
                      name={"example-disabled-input"}
                      placeholder={"Disabled..."}
                      defaultValue={"Managed by your workspace"}
                      disabled
                    />{" "}
                  </div>
                </div>
                <div className="form-workbench-example">
                  <div className={"pn-mb-3"}>
                    {" "}
                    <label className={"pn-form-label"} htmlFor={"fe1-readonly"}>
                      {" Readonly "}
                    </label>{" "}
                    <WorkspaceInput
                      type={"text"}
                      className={"pn-form-control"}
                      id={"fe1-readonly"}
                      name={"example-disabled-input"}
                      placeholder={"Readonly..."}
                      defaultValue={"workspace@acme.example"}
                      readOnly
                    />{" "}
                  </div>
                </div>
                <div className="form-workbench-example">
                  <div className={"pn-mb-3"}>
                    {" "}
                    <div className={"pn-form-label"}>
                      {"Form control rounded"}
                    </div>{" "}
                    <WorkspaceInput
                      type={"text"}
                      className={
                        "pn-form-control pn-form-control-rounded pn-mb-2"
                      }
                      name={"Form control rounded"}
                      placeholder={"Text.."}
                    />{" "}
                    <div className={"pn-input-icon"}>
                      {" "}
                      <WorkspaceInput
                        type={"text"}
                        defaultValue={""}
                        className={"pn-form-control pn-form-control-rounded"}
                        placeholder={"Search…"}
                      />{" "}
                      <span className={"pn-input-icon-addon"}>
                        {" "}
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
                          className={"pn-icon"}
                        >
                          {" "}
                          <path
                            d={"M3 10a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"}
                          ></path>{" "}
                          <path d={"M21 21l-6 -6"}></path>{" "}
                        </svg>{" "}
                      </span>{" "}
                    </div>{" "}
                  </div>
                </div>
                <div className="form-workbench-example">
                  <div className={"pn-mb-3"}>
                    {" "}
                    <label
                      className={"pn-form-label"}
                      htmlFor={"fe2-form-control-flush"}
                    >
                      {" Form control flush "}
                    </label>{" "}
                    <WorkspaceInput
                      type={"text"}
                      className={"pn-form-control pn-form-control-flush"}
                      id={"fe2-form-control-flush"}
                      name={"Form control flush"}
                      placeholder={"Text.."}
                    />{" "}
                  </div>
                </div>
                <div className="form-workbench-example is-floating">
                  <div className={"pn-mb-3"}>
                    {" "}
                    <div className={"pn-form-label"}>
                      {"Floating inputs"}
                    </div>{" "}
                    <div className={"pn-form-floating pn-mb-3"}>
                      {" "}
                      <WorkspaceInput
                        type={"email"}
                        className={"pn-form-control"}
                        id={"floating-input"}
                        defaultValue={"name@example.com"}
                        autoComplete={"off"}
                      />{" "}
                      <label htmlFor={"floating-input"}>
                        {"Email address"}
                      </label>{" "}
                    </div>{" "}
                    <div className={"pn-form-floating pn-mb-3"}>
                      {" "}
                      <WorkspaceInput
                        type={"password"}
                        className={"pn-form-control"}
                        id={"floating-password"}
                        defaultValue={"Password"}
                        autoComplete={"off"}
                      />{" "}
                      <label htmlFor={"floating-password"}>
                        {"Password"}
                      </label>{" "}
                    </div>{" "}
                    <div className={"pn-form-floating"}>
                      {" "}
                      <WorkspaceSelect
                        className={"pn-form-select"}
                        id={"floatingSelect"}
                        aria-label={"Floating label select example"}
                        defaultValue={"Open this select menu"}
                      >
                        <option>{"Open this select menu"}</option>
                        <option value={"1"}>{"One"}</option>
                        <option value={"2"}>{"Two"}</option>
                        <option value={"3"}>{"Three"}</option>
                      </WorkspaceSelect>{" "}
                      <label htmlFor={"floatingSelect"}>{"Select"}</label>{" "}
                    </div>{" "}
                  </div>
                </div>
              </CardContent>
            </WorkspaceForm>
          </section>
          <section
            id="form-category-selects"
            className="form-workbench-section"
            hidden={category !== "selects"}
            aria-labelledby="form-title-selects"
          >
            <div className="form-workbench-section-heading">
              <div>
                <h2 id="form-title-selects">Find the right option</h2>
                <p>
                  Simple lists, searchable options, and multi-select inputs.
                </p>
              </div>
              <span>11 examples</span>
            </div>
            <WorkspaceForm className="pn-card form-workbench-card">
              <CardContent className="pn-card-body form-workbench-fields">
                <div className="form-workbench-example">
                  <div className={"pn-mb-3"}>
                    {" "}
                    <div className={"pn-form-label"}>{"Select"}</div>{" "}
                    <WorkspaceSelect className={"pn-form-select"}>
                      <option value={"1"}>{"One"}</option>
                      <option value={"2"}>{"Two"}</option>
                      <option value={"3"}>{"Three"}</option>
                    </WorkspaceSelect>{" "}
                  </div>
                </div>
                <div className="form-workbench-example">
                  <div className={"pn-mb-3"}>
                    {" "}
                    <div className={"pn-form-label"}>
                      {"Select multiple"}
                    </div>{" "}
                    <WorkspaceSelect className={"pn-form-select"} multiple>
                      <option value={"1"}>{"One"}</option>
                      <option value={"2"}>{"Two"}</option>
                      <option value={"3"}>{"Three"}</option>
                    </WorkspaceSelect>{" "}
                  </div>
                </div>
                <div className="form-workbench-example">
                  <div className={"pn-mb-3"}>
                    {" "}
                    <div className={"pn-form-label"}>
                      {"Select multiple states"}
                    </div>{" "}
                    <WorkspaceSelect
                      className={"pn-form-select"}
                      id={"select-states"}
                      multiple
                      defaultValue={["AZ"]}
                    >
                      <option value={"AL"}>{"Alabama"}</option>
                      <option value={"AK"}>{"Alaska"}</option>
                      <option value={"AZ"}>{"Arizona"}</option>
                      <option value={"AR"}>{"Arkansas"}</option>
                      <option value={"CA"}>{"California"}</option>
                      <option value={"CO"}>{"Colorado"}</option>
                      <option value={"CT"}>{"Connecticut"}</option>
                      <option value={"DE"}>{"Delaware"}</option>
                      <option value={"DC"}>{"District of Columbia"}</option>
                      <option value={"FL"}>{"Florida"}</option>
                      <option value={"GA"}>{"Georgia"}</option>
                      <option value={"HI"}>{"Hawaii"}</option>
                      <option value={"ID"}>{"Idaho"}</option>
                      <option value={"IL"}>{"Illinois"}</option>
                      <option value={"IN"}>{"Indiana"}</option>
                      <option value={"IA"}>{"Iowa"}</option>
                      <option value={"KS"}>{"Kansas"}</option>
                      <option value={"KY"}>{"Kentucky"}</option>
                      <option value={"LA"}>{"Louisiana"}</option>
                      <option value={"ME"}>{"Maine"}</option>
                      <option value={"MD"}>{"Maryland"}</option>
                      <option value={"MA"}>{"Massachusetts"}</option>
                      <option value={"MI"}>{"Michigan"}</option>
                      <option value={"MN"}>{"Minnesota"}</option>
                      <option value={"MS"}>{"Mississippi"}</option>
                      <option value={"MO"}>{"Missouri"}</option>
                      <option value={"MT"}>{"Montana"}</option>
                      <option value={"NE"}>{"Nebraska"}</option>
                      <option value={"NV"}>{"Nevada"}</option>
                      <option value={"NH"}>{"New Hampshire"}</option>
                      <option value={"NJ"}>{"New Jersey"}</option>
                      <option value={"NM"}>{"New Mexico"}</option>
                      <option value={"NY"}>{"New York"}</option>
                      <option value={"NC"}>{"North Carolina"}</option>
                      <option value={"ND"}>{"North Dakota"}</option>
                      <option value={"OH"}>{"Ohio"}</option>
                      <option value={"OK"}>{"Oklahoma"}</option>
                      <option value={"OR"}>{"Oregon"}</option>
                      <option value={"PA"}>{"Pennsylvania"}</option>
                      <option value={"RI"}>{"Rhode Island"}</option>
                      <option value={"SC"}>{"South Carolina"}</option>
                      <option value={"SD"}>{"South Dakota"}</option>
                      <option value={"TN"}>{"Tennessee"}</option>
                      <option value={"TX"}>{"Texas"}</option>
                      <option value={"UT"}>{"Utah"}</option>
                      <option value={"VT"}>{"Vermont"}</option>
                      <option value={"VA"}>{"Virginia"}</option>
                      <option value={"WA"}>{"Washington"}</option>
                      <option value={"WV"}>{"West Virginia"}</option>
                      <option value={"WI"}>{"Wisconsin"}</option>
                      <option value={"WY"}>{"Wyoming"}</option>
                    </WorkspaceSelect>{" "}
                  </div>
                </div>
                <div className="form-workbench-example">
                  <div className={"pn-mb-3"}>
                    {" "}
                    <label className={"pn-form-label"} htmlFor={"fe6-datalist"}>
                      {" Datalist example "}
                    </label>{" "}
                    <WorkspaceInput
                      className={"pn-form-control"}
                      id={"fe6-datalist"}
                      list={"datalistOptions"}
                      placeholder={"Type to search..."}
                    />{" "}
                    <datalist id={"datalistOptions"}>
                      {" "}
                      <option value={"Andorra"}></option>{" "}
                      <option value={"United Arab Emirates"}></option>{" "}
                      <option value={"Afghanistan"}></option>{" "}
                      <option value={"Antigua"}></option>{" "}
                      <option value={"Anguilla"}></option>{" "}
                      <option value={"Armenia"}></option>{" "}
                      <option value={"Angolan"}></option>{" "}
                      <option value={"Antarctica"}></option>{" "}
                      <option value={"Argentina"}></option>{" "}
                      <option value={"American Samoa"}></option>{" "}
                    </datalist>{" "}
                  </div>
                </div>
                <div className="form-workbench-example">
                  <div className={"pn-mb-3"}>
                    {" "}
                    <label
                      className={"pn-form-label"}
                      htmlFor={"select-fe6-tags"}
                    >
                      {" Tags input "}
                    </label>{" "}
                    <WorkspaceSelect
                      className={"pn-form-select"}
                      data-placeholder={"Select tags"}
                      id={"select-fe6-tags"}
                      multiple
                      defaultValue={"HTML"}
                    >
                      <option value={"HTML"}>{"HTML"}</option>
                      <option value={"JavaScript"}>{"JavaScript"}</option>
                      <option value={"CSS"}>{"CSS"}</option>
                      <option value={"jQuery"}>{"jQuery"}</option>
                      <option value={"TypeScript"}>{"TypeScript"}</option>
                      <option value={"Ruby"}>{"Ruby"}</option>
                      <option value={"Python"}>{"Python"}</option>
                    </WorkspaceSelect>{" "}
                  </div>
                </div>
                <div className="form-workbench-example">
                  <div className={"pn-mb-3"}>
                    {" "}
                    <label
                      className={"pn-form-label"}
                      htmlFor={"select-fe6-advanced-select"}
                    >
                      {" Advanced select "}
                    </label>{" "}
                    <WorkspaceSelect
                      className={"pn-form-select"}
                      id={"select-fe6-advanced-select"}
                      defaultValue={"3"}
                    >
                      <option value={"1"}>{"Chuck Tesla"}</option>
                      <option value={"2"}>{"Elon Musk"}</option>
                      <option value={"3"}>{"Maya Okafor"}</option>
                      <option value={"4"}>{"Nikola Tesla"}</option>
                    </WorkspaceSelect>{" "}
                  </div>
                </div>
                <div className="form-workbench-example">
                  <div className={"pn-mb-3"}>
                    {" "}
                    <label
                      className={"pn-form-label"}
                      htmlFor={"select-fe6-select-optgroup"}
                    >
                      {" Advanced select with optgroup "}
                    </label>{" "}
                    <WorkspaceSelect
                      className={"pn-form-select"}
                      id={"select-fe6-select-optgroup"}
                    >
                      <optgroup label={"Tags"}>
                        <option value={"HTML"}>{"HTML"}</option>
                        <option value={"JavaScript"}>{"JavaScript"}</option>
                        <option value={"CSS"}>{"CSS"}</option>
                        <option value={"jQuery"}>{"jQuery"}</option>
                        <option value={"TypeScript"}>{"TypeScript"}</option>
                        <option value={"Ruby"}>{"Ruby"}</option>
                        <option value={"Python"}>{"Python"}</option>
                      </optgroup>
                      <optgroup label={"People"}>
                        <option value={"Chuck Tesla"}>{"Chuck Tesla"}</option>
                        <option value={"Elon Musk"}>{"Elon Musk"}</option>
                        <option value={"Maya Okafor"}>{"Maya Okafor"}</option>
                        <option value={"Nikola Tesla"}>{"Nikola Tesla"}</option>
                      </optgroup>
                    </WorkspaceSelect>{" "}
                  </div>
                </div>
                <div className="form-workbench-example">
                  <div className={"pn-mb-3"}>
                    {" "}
                    <label
                      className={"pn-form-label"}
                      htmlFor={"select-fe6-select-avatars"}
                    >
                      {" Select with avatars "}
                    </label>{" "}
                    <WorkspaceSelect
                      className={"pn-form-select"}
                      id={"select-fe6-select-avatars"}
                      defaultValue={"4"}
                    >
                      <option
                        value={"1"}
                        data-custom-properties={
                          '<span class="avatar avatar-xs" style="background-image: url(./static/avatars/000m.jpg)"></span>'
                        }
                      >
                        {"Maya Okafor"}
                      </option>
                      <option
                        value={"2"}
                        data-custom-properties={
                          '<span class="avatar avatar-xs" style="background-image: url(./static/avatars/052f.jpg)"></span>'
                        }
                      >
                        {"Samir Haddad"}
                      </option>
                      <option
                        value={"3"}
                        data-custom-properties={
                          '<span class="avatar avatar-xs" style="background-image: url(./static/avatars/002m.jpg)"></span>'
                        }
                      >
                        {"Ines Duarte"}
                      </option>
                      <option
                        value={"4"}
                        data-custom-properties={
                          '<span class="avatar avatar-xs" style="background-image: url(./static/avatars/003m.jpg)"></span>'
                        }
                      >
                        {"Alina Petrova"}
                      </option>
                      <option
                        value={"5"}
                        data-custom-properties={
                          '<span class="avatar avatar-xs" style="background-image: url(./static/avatars/000f.jpg)"></span>'
                        }
                      >
                        {"Nora Jensen"}
                      </option>
                      <option
                        value={"6"}
                        data-custom-properties={
                          '<span class="avatar avatar-xs" style="background-image: url(./static/avatars/001f.jpg)"></span>'
                        }
                      >
                        {"June Park"}
                      </option>
                      <option
                        value={"7"}
                        data-custom-properties={
                          '<span class="avatar avatar-xs" style="background-image: url(./static/avatars/004m.jpg)"></span>'
                        }
                      >
                        {"Tomas Silva"}
                      </option>
                      <option
                        value={"8"}
                        data-custom-properties={
                          '<span class="avatar avatar-xs" style="background-image: url(./static/avatars/002f.jpg)"></span>'
                        }
                      >
                        {"Alina Petrova"}
                      </option>
                      <option
                        value={"9"}
                        data-custom-properties={
                          '<span class="avatar avatar-xs" style="background-image: url(./static/avatars/003f.jpg)"></span>'
                        }
                      >
                        {"Tomas Silva"}
                      </option>
                      <option
                        value={"10"}
                        data-custom-properties={
                          '<span class="avatar avatar-xs" style="background-image: url(./static/avatars/063m.jpg)"></span>'
                        }
                      >
                        {"Nora Jensen"}
                      </option>
                      <option
                        value={"11"}
                        data-custom-properties={
                          '<span class="avatar avatar-xs" style="background-image: url(./static/avatars/006m.jpg)"></span>'
                        }
                      >
                        {"Lorry Mion"}
                      </option>
                      <option
                        value={"12"}
                        data-custom-properties={
                          '<span class="avatar avatar-xs" style="background-image: url(./static/avatars/004f.jpg)"></span>'
                        }
                      >
                        {"Maya Okafor"}
                      </option>
                      <option
                        value={"13"}
                        data-custom-properties={
                          '<span class="avatar avatar-xs" style="background-image: url(./static/avatars/007m.jpg)"></span>'
                        }
                      >
                        {"Leo Nakamura"}
                      </option>
                      <option
                        value={"14"}
                        data-custom-properties={
                          '<span class="avatar avatar-xs">SA</span>'
                        }
                      >
                        {"Ines Duarte"}
                      </option>
                      <option
                        value={"15"}
                        data-custom-properties={
                          '<span class="avatar avatar-xs" style="background-image: url(./static/avatars/009m.jpg)"></span>'
                        }
                      >
                        {"Samir Haddad"}
                      </option>
                      <option
                        value={"16"}
                        data-custom-properties={
                          '<span class="avatar avatar-xs" style="background-image: url(./static/avatars/010m.jpg)"></span>'
                        }
                      >
                        {"June Park"}
                      </option>
                      <option
                        value={"17"}
                        data-custom-properties={
                          '<span class="avatar avatar-xs" style="background-image: url(./static/avatars/005f.jpg)"></span>'
                        }
                      >
                        {"Alina Petrova"}
                      </option>
                      <option
                        value={"18"}
                        data-custom-properties={
                          '<span class="avatar avatar-xs" style="background-image: url(./static/avatars/006f.jpg)"></span>'
                        }
                      >
                        {"Tomas Silva"}
                      </option>
                      <option
                        value={"19"}
                        data-custom-properties={
                          '<span class="avatar avatar-xs">AA</span>'
                        }
                      >
                        {"Nora Jensen"}
                      </option>
                      <option
                        value={"20"}
                        data-custom-properties={
                          '<span class="avatar avatar-xs" style="background-image: url(./static/avatars/008f.jpg)"></span>'
                        }
                      >
                        {"Maya Okafor"}
                      </option>
                    </WorkspaceSelect>{" "}
                  </div>
                </div>
                <div className="form-workbench-example">
                  <div className={"pn-mb-3"}>
                    {" "}
                    <label
                      className={"pn-form-label"}
                      htmlFor={"select-fe6-select-flags"}
                    >
                      {" Select with flags "}
                    </label>{" "}
                    <WorkspaceSelect
                      className={"pn-form-select"}
                      id={"select-fe6-select-flags"}
                      defaultValue={"pl"}
                    >
                      <option
                        value={"pl"}
                        data-custom-properties={
                          '<span class="flag flag-xs flag-country-pl"></span>'
                        }
                      >
                        {"Poland"}
                      </option>
                      <option
                        value={"de"}
                        data-custom-properties={
                          '<span class="flag flag-xs flag-country-de"></span>'
                        }
                      >
                        {"Germany"}
                      </option>
                      <option
                        value={"cz"}
                        data-custom-properties={
                          '<span class="flag flag-xs flag-country-cz"></span>'
                        }
                      >
                        {"Czech Republic"}
                      </option>
                      <option
                        value={"br"}
                        data-custom-properties={
                          '<span class="flag flag-xs flag-country-br"></span>'
                        }
                      >
                        {"Brazil"}
                      </option>
                    </WorkspaceSelect>{" "}
                  </div>
                </div>
                <div className="form-workbench-example">
                  <div className={"pn-mb-3"}>
                    {" "}
                    <label
                      className={"pn-form-label"}
                      htmlFor={"select-fe6-select-labels"}
                    >
                      {" Select with labels "}
                    </label>{" "}
                    <WorkspaceSelect
                      className={"pn-form-select"}
                      id={"select-fe6-select-labels"}
                      defaultValue={"paste"}
                    >
                      <option
                        value={"copy"}
                        data-custom-properties={
                          '<span class="badge bg-primary-lt">cmd + C</span>'
                        }
                      >
                        {"Copy"}
                      </option>
                      <option
                        value={"paste"}
                        data-custom-properties={
                          '<span class="badge bg-primary-lt">cmd + V</span>'
                        }
                      >
                        {"Paste"}
                      </option>
                      <option
                        value={"cut"}
                        data-custom-properties={
                          '<span class="badge bg-primary-lt">cmd + X</span>'
                        }
                      >
                        {"Cut"}
                      </option>
                    </WorkspaceSelect>{" "}
                  </div>
                </div>
                <div className="form-workbench-example is-validation">
                  <div className={"pn-mb-3"}>
                    {" "}
                    <div className={"pn-form-label"}>
                      {"Advanced select with validation state"}
                    </div>{" "}
                    <WorkspaceSelect
                      className={"pn-form-select pn-mb-3 pn-is-valid"}
                      id={"select-countries-valid"}
                      defaultValue={"pl"}
                    >
                      <option value={"pl"}>{"Poland"}</option>
                      <option value={"de"}>{"Germany"}</option>
                      <option value={"cz"}>{"Czech Republic"}</option>
                      <option value={"br"}>{"Brazil"}</option>
                    </WorkspaceSelect>{" "}
                    <WorkspaceSelect
                      className={"pn-form-select pn-is-invalid"}
                      id={"select-countries-invalid"}
                      defaultValue={"pl"}
                    >
                      <option value={"pl"}>{"Poland"}</option>
                      <option value={"de"}>{"Germany"}</option>
                      <option value={"cz"}>{"Czech Republic"}</option>
                      <option value={"br"}>{"Brazil"}</option>
                    </WorkspaceSelect>{" "}
                  </div>
                </div>
              </CardContent>
            </WorkspaceForm>
          </section>
          <section
            id="form-category-choices"
            className="form-workbench-section"
            hidden={category !== "choices"}
            aria-labelledby="form-title-choices"
          >
            <div className="form-workbench-section-heading">
              <div>
                <h2 id="form-title-choices">Make a choice</h2>
                <p>
                  Radio buttons, checkboxes, and preferences with room for
                  context.
                </p>
              </div>
              <span>12 examples</span>
            </div>
            <WorkspaceForm className="pn-card form-workbench-card">
              <CardContent className="pn-card-body form-workbench-fields">
                <div className="form-workbench-example">
                  <div className={"pn-mb-3"}>
                    {" "}
                    <div className={"pn-form-label"}>{"Radios"}</div>{" "}
                    <fieldset>
                      {" "}
                      <legend className={"pn-visually-hidden"}>
                        {"Radios"}
                      </legend>{" "}
                      <label className={"pn-form-check"}>
                        {" "}
                        <WorkspaceInput
                          className={"pn-form-check-input"}
                          type={"radio"}
                          name={"radios"}
                          defaultChecked
                        />{" "}
                        <span className={"pn-form-check-label"}>
                          {"Option 1"}
                        </span>{" "}
                      </label>{" "}
                      <label className={"pn-form-check"}>
                        {" "}
                        <WorkspaceInput
                          className={"pn-form-check-input"}
                          type={"radio"}
                          name={"radios"}
                        />{" "}
                        <span className={"pn-form-check-label"}>
                          {"Option 2"}
                        </span>{" "}
                      </label>{" "}
                      <label className={"pn-form-check"}>
                        {" "}
                        <WorkspaceInput
                          className={"pn-form-check-input"}
                          type={"radio"}
                          disabled
                        />{" "}
                        <span className={"pn-form-check-label"}>
                          {"Option 3"}
                        </span>{" "}
                      </label>{" "}
                      <label className={"pn-form-check"}>
                        {" "}
                        <WorkspaceInput
                          className={"pn-form-check-input"}
                          type={"radio"}
                          defaultChecked
                          disabled
                        />{" "}
                        <span className={"pn-form-check-label"}>
                          {"Option 4"}
                        </span>{" "}
                      </label>{" "}
                    </fieldset>{" "}
                  </div>
                </div>
                <div className="form-workbench-example">
                  <div className={"pn-mb-3"}>
                    {" "}
                    <div className={"pn-form-label"}>
                      {"Inline Radios"}
                    </div>{" "}
                    <fieldset>
                      {" "}
                      <legend className={"pn-visually-hidden"}>
                        {"Inline Radios"}
                      </legend>{" "}
                      <label className={"pn-form-check pn-form-check-inline"}>
                        {" "}
                        <WorkspaceInput
                          className={"pn-form-check-input"}
                          type={"radio"}
                          name={"radios-inline"}
                          defaultChecked
                        />{" "}
                        <span className={"pn-form-check-label"}>
                          {"Option 1"}
                        </span>{" "}
                      </label>{" "}
                      <label className={"pn-form-check pn-form-check-inline"}>
                        {" "}
                        <WorkspaceInput
                          className={"pn-form-check-input"}
                          type={"radio"}
                          name={"radios-inline"}
                        />{" "}
                        <span className={"pn-form-check-label"}>
                          {"Option 2"}
                        </span>{" "}
                      </label>{" "}
                      <label className={"pn-form-check pn-form-check-inline"}>
                        {" "}
                        <WorkspaceInput
                          className={"pn-form-check-input"}
                          type={"radio"}
                          name={"radios-inline"}
                          disabled
                        />{" "}
                        <span className={"pn-form-check-label"}>
                          {"Option 3"}
                        </span>{" "}
                      </label>{" "}
                    </fieldset>{" "}
                  </div>
                </div>
                <div className="form-workbench-example">
                  <div className={"pn-mb-3"}>
                    {" "}
                    <div className={"pn-form-label"}>{"Checkboxes"}</div>{" "}
                    <fieldset>
                      {" "}
                      <legend className={"pn-visually-hidden"}>
                        {"Checkboxes"}
                      </legend>{" "}
                      <label className={"pn-form-check"}>
                        {" "}
                        <WorkspaceInput
                          className={"pn-form-check-input"}
                          type={"checkbox"}
                        />{" "}
                        <span className={"pn-form-check-label"}>
                          {"Checkbox input"}
                        </span>{" "}
                      </label>{" "}
                      <label className={"pn-form-check"}>
                        {" "}
                        <WorkspaceInput
                          className={"pn-form-check-input"}
                          type={"checkbox"}
                          disabled
                        />{" "}
                        <span className={"pn-form-check-label"}>
                          {"Disabled checkbox input"}
                        </span>{" "}
                      </label>{" "}
                      <label className={"pn-form-check"}>
                        {" "}
                        <WorkspaceInput
                          className={"pn-form-check-input"}
                          type={"checkbox"}
                          defaultChecked
                        />{" "}
                        <span className={"pn-form-check-label"}>
                          {"Checked checkbox input"}
                        </span>{" "}
                      </label>{" "}
                    </fieldset>{" "}
                  </div>
                </div>
                <div className="form-workbench-example">
                  <div className={"pn-mb-3"}>
                    {" "}
                    <div className={"pn-form-label"}>
                      {"Inline Checkboxes"}
                    </div>{" "}
                    <fieldset>
                      {" "}
                      <legend className={"pn-visually-hidden"}>
                        {"Inline Checkboxes"}
                      </legend>{" "}
                      <label className={"pn-form-check pn-form-check-inline"}>
                        {" "}
                        <WorkspaceInput
                          className={"pn-form-check-input"}
                          type={"checkbox"}
                        />{" "}
                        <span className={"pn-form-check-label"}>
                          {"Option 1"}
                        </span>{" "}
                      </label>{" "}
                      <label className={"pn-form-check pn-form-check-inline"}>
                        {" "}
                        <WorkspaceInput
                          className={"pn-form-check-input"}
                          type={"checkbox"}
                          disabled
                        />{" "}
                        <span className={"pn-form-check-label"}>
                          {"Option 2"}
                        </span>{" "}
                      </label>{" "}
                      <label className={"pn-form-check pn-form-check-inline"}>
                        {" "}
                        <WorkspaceInput
                          className={"pn-form-check-input"}
                          type={"checkbox"}
                          defaultChecked
                        />{" "}
                        <span className={"pn-form-check-label"}>
                          {"Option 3"}
                        </span>{" "}
                      </label>{" "}
                    </fieldset>{" "}
                  </div>
                </div>
                <div className="form-workbench-example">
                  <div className={"pn-mb-3"}>
                    {" "}
                    <div className={"pn-form-label"}>
                      {"Checkboxes with description"}
                    </div>{" "}
                    <fieldset>
                      {" "}
                      <legend className={"pn-visually-hidden"}>
                        {"Checkboxes with description"}
                      </legend>{" "}
                      <label className={"pn-form-check"}>
                        {" "}
                        <WorkspaceInput
                          className={"pn-form-check-input"}
                          type={"checkbox"}
                        />{" "}
                        <span className={"pn-form-check-label"}>
                          {" Default checkbox "}
                        </span>{" "}
                        <span className={"pn-form-check-description"}>
                          {
                            "Useful controls for briefs, preferences, and project settings."
                          }
                        </span>{" "}
                      </label>{" "}
                      <label className={"pn-form-check"}>
                        {" "}
                        <WorkspaceInput
                          className={"pn-form-check-input"}
                          type={"checkbox"}
                        />{" "}
                        <span className={"pn-form-check-label"}>
                          {
                            " Include the project brief and handover notes in the client review package "
                          }
                        </span>{" "}
                        <span className={"pn-form-check-description"}>
                          {
                            "Share the work early enough for feedback to matter. Explain the question you are trying to answer and what would help you move forward."
                          }
                        </span>{" "}
                      </label>{" "}
                      <label className={"pn-form-check"}>
                        {" "}
                        <WorkspaceInput
                          className={"pn-form-check-input"}
                          type={"checkbox"}
                        />{" "}
                        <span className={"pn-form-check-label"}>
                          {" Default checkbox without description "}
                        </span>{" "}
                      </label>{" "}
                    </fieldset>{" "}
                  </div>
                </div>
                <div className="form-workbench-example">
                  <div className={"pn-mb-3"}>
                    {" "}
                    <div className={"pn-form-label"}>
                      {"Toggle switches"}
                    </div>{" "}
                    <fieldset>
                      {" "}
                      <legend className={"pn-visually-hidden"}>
                        {"Toggle switches"}
                      </legend>{" "}
                      <label className={"pn-form-check pn-form-switch"}>
                        {" "}
                        <WorkspaceInput
                          className={"pn-form-check-input"}
                          type={"checkbox"}
                          defaultChecked
                        />{" "}
                        <span className={"pn-form-check-label"}>
                          {"Option 1"}
                        </span>{" "}
                      </label>{" "}
                      <label className={"pn-form-check pn-form-switch"}>
                        {" "}
                        <WorkspaceInput
                          className={"pn-form-check-input"}
                          type={"checkbox"}
                        />{" "}
                        <span className={"pn-form-check-label"}>
                          {"Option 2"}
                        </span>{" "}
                      </label>{" "}
                      <label className={"pn-form-check pn-form-switch"}>
                        {" "}
                        <WorkspaceInput
                          className={"pn-form-check-input"}
                          type={"checkbox"}
                        />{" "}
                        <span className={"pn-form-check-label"}>
                          {"Option 3"}
                        </span>{" "}
                      </label>{" "}
                    </fieldset>{" "}
                  </div>
                </div>
                <div className="form-workbench-example">
                  <div className={"pn-mb-3"}>
                    {" "}
                    <div className={"pn-form-label"}>
                      {"Single switch"}
                    </div>{" "}
                    <label className={"pn-form-check pn-form-switch"}>
                      {" "}
                      <WorkspaceInput
                        className={"pn-form-check-input"}
                        type={"checkbox"}
                      />{" "}
                      <span className={"pn-form-check-label"}>
                        {"I agree with terms and conditions"}
                      </span>{" "}
                    </label>{" "}
                  </div>
                </div>
                <div className="form-workbench-example">
                  <div className={"pn-mb-3"}>
                    {" "}
                    <div className={"pn-form-label"}>{"Notification"}</div>{" "}
                    <fieldset>
                      {" "}
                      <legend className={"pn-visually-hidden"}>
                        {"Notification"}
                      </legend>{" "}
                      <div className={"pn-divide-y"}>
                        {" "}
                        <div>
                          {" "}
                          <label className={"pn-row"}>
                            {" "}
                            <span className={"pn-col"}>
                              {"Push Notifications"}
                            </span>{" "}
                            <span className={"pn-col-auto"}>
                              {" "}
                              <span
                                className={
                                  "pn-form-check pn-form-check-single pn-form-switch"
                                }
                              >
                                {" "}
                                <WorkspaceInput
                                  className={"pn-form-check-input"}
                                  type={"checkbox"}
                                  defaultChecked
                                />{" "}
                              </span>{" "}
                            </span>{" "}
                          </label>{" "}
                        </div>{" "}
                        <div>
                          {" "}
                          <label className={"pn-row"}>
                            {" "}
                            <span className={"pn-col"}>
                              {"SMS Notifications"}
                            </span>{" "}
                            <span className={"pn-col-auto"}>
                              {" "}
                              <span
                                className={
                                  "pn-form-check pn-form-check-single pn-form-switch"
                                }
                              >
                                {" "}
                                <WorkspaceInput
                                  className={"pn-form-check-input"}
                                  type={"checkbox"}
                                />{" "}
                              </span>{" "}
                            </span>{" "}
                          </label>{" "}
                        </div>{" "}
                        <div>
                          {" "}
                          <label className={"pn-row"}>
                            {" "}
                            <span className={"pn-col"}>
                              {"Email Notifications"}
                            </span>{" "}
                            <span className={"pn-col-auto"}>
                              {" "}
                              <span
                                className={
                                  "pn-form-check pn-form-check-single pn-form-switch"
                                }
                              >
                                {" "}
                                <WorkspaceInput
                                  className={"pn-form-check-input"}
                                  type={"checkbox"}
                                  defaultChecked
                                />{" "}
                              </span>{" "}
                            </span>{" "}
                          </label>{" "}
                        </div>{" "}
                      </div>{" "}
                    </fieldset>{" "}
                  </div>
                </div>
                <div className="form-workbench-example">
                  <div className={"pn-mb-3"}>
                    {" "}
                    <div className={"pn-form-label"}>
                      {"Simple selectgroup"}
                    </div>{" "}
                    <fieldset>
                      {" "}
                      <legend className={"pn-visually-hidden"}>
                        {"Simple selectgroup"}
                      </legend>{" "}
                      <div className={"pn-form-selectgroup"}>
                        {" "}
                        <label className={"pn-form-selectgroup-item"}>
                          {" "}
                          <WorkspaceInput
                            type={"checkbox"}
                            name={"name"}
                            defaultValue={"HTML"}
                            className={"pn-form-selectgroup-input"}
                            defaultChecked
                          />{" "}
                          <span className={"pn-form-selectgroup-label"}>
                            {"HTML"}
                          </span>{" "}
                        </label>{" "}
                        <label className={"pn-form-selectgroup-item"}>
                          {" "}
                          <WorkspaceInput
                            type={"checkbox"}
                            name={"name"}
                            defaultValue={"CSS"}
                            className={"pn-form-selectgroup-input"}
                          />{" "}
                          <span className={"pn-form-selectgroup-label"}>
                            {"CSS"}
                          </span>{" "}
                        </label>{" "}
                        <label className={"pn-form-selectgroup-item"}>
                          {" "}
                          <WorkspaceInput
                            type={"checkbox"}
                            name={"name"}
                            defaultValue={"PHP"}
                            className={"pn-form-selectgroup-input"}
                          />{" "}
                          <span className={"pn-form-selectgroup-label"}>
                            {"PHP"}
                          </span>{" "}
                        </label>{" "}
                        <label className={"pn-form-selectgroup-item"}>
                          {" "}
                          <WorkspaceInput
                            type={"checkbox"}
                            name={"name"}
                            defaultValue={"JavaScript"}
                            className={"pn-form-selectgroup-input"}
                          />{" "}
                          <span className={"pn-form-selectgroup-label"}>
                            {"JavaScript"}
                          </span>{" "}
                        </label>{" "}
                      </div>{" "}
                    </fieldset>{" "}
                  </div>
                </div>
                <div className="form-workbench-example">
                  <div className={"pn-mb-3"}>
                    {" "}
                    <div className={"pn-form-label"}>{"Icon input"}</div>{" "}
                    <fieldset>
                      {" "}
                      <legend className={"pn-visually-hidden"}>
                        {"Icon input"}
                      </legend>{" "}
                      <div className={"pn-form-selectgroup"}>
                        {" "}
                        <label className={"pn-form-selectgroup-item"}>
                          {" "}
                          <WorkspaceInput
                            type={"checkbox"}
                            name={"name"}
                            defaultValue={"sun"}
                            className={"pn-form-selectgroup-input"}
                            defaultChecked
                          />{" "}
                          <span className={"pn-form-selectgroup-label"}>
                            {" "}
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
                              className={"pn-icon"}
                            >
                              {" "}
                              <path
                                d={"M8 12a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"}
                              ></path>{" "}
                              <path
                                d={
                                  "M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7"
                                }
                              ></path>
                            </svg>
                          </span>{" "}
                        </label>{" "}
                        <label className={"pn-form-selectgroup-item"}>
                          {" "}
                          <WorkspaceInput
                            type={"checkbox"}
                            name={"name"}
                            defaultValue={"moon"}
                            className={"pn-form-selectgroup-input"}
                          />{" "}
                          <span className={"pn-form-selectgroup-label"}>
                            {" "}
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
                              className={"pn-icon"}
                            >
                              {" "}
                              <path
                                d={
                                  "M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454l0 .008"
                                }
                              ></path>
                            </svg>
                          </span>{" "}
                        </label>{" "}
                        <label className={"pn-form-selectgroup-item"}>
                          {" "}
                          <WorkspaceInput
                            type={"checkbox"}
                            name={"name"}
                            defaultValue={"cloud-rain"}
                            className={"pn-form-selectgroup-input"}
                          />{" "}
                          <span className={"pn-form-selectgroup-label"}>
                            {" "}
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
                              className={"pn-icon"}
                            >
                              {" "}
                              <path
                                d={
                                  "M7 18a4.6 4.4 0 0 1 0 -9a5 4.5 0 0 1 11 2h1a3.5 3.5 0 0 1 0 7"
                                }
                              ></path>{" "}
                              <path d={"M11 13v2m0 3v2m4 -5v2m0 3v2"}></path>
                            </svg>
                          </span>{" "}
                        </label>{" "}
                        <label className={"pn-form-selectgroup-item"}>
                          {" "}
                          <WorkspaceInput
                            type={"checkbox"}
                            name={"name"}
                            defaultValue={"cloud"}
                            className={"pn-form-selectgroup-input"}
                          />{" "}
                          <span className={"pn-form-selectgroup-label"}>
                            {" "}
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
                              className={"pn-icon"}
                            >
                              {" "}
                              <path
                                d={
                                  "M6.657 18c-2.572 0 -4.657 -2.007 -4.657 -4.483c0 -2.475 2.085 -4.482 4.657 -4.482c.393 -1.762 1.794 -3.2 3.675 -3.773c1.88 -.572 3.956 -.193 5.444 1c1.488 1.19 2.162 3.007 1.77 4.769h.99c1.913 0 3.464 1.56 3.464 3.486c0 1.927 -1.551 3.487 -3.465 3.487h-11.878"
                                }
                              ></path>
                            </svg>
                          </span>{" "}
                        </label>{" "}
                        <label className={"pn-form-selectgroup-item"}>
                          {" "}
                          <WorkspaceInput
                            type={"checkbox"}
                            name={"name"}
                            defaultValue={"Other"}
                            className={"pn-form-selectgroup-input"}
                          />{" "}
                          <span className={"pn-form-selectgroup-label"}>
                            {"Other"}
                          </span>{" "}
                        </label>{" "}
                      </div>{" "}
                    </fieldset>{" "}
                  </div>
                </div>
                <div className="form-workbench-example">
                  <div className={"pn-mb-3"}>
                    {" "}
                    <div className={"pn-form-label"}>
                      {"Selectgroup with icons and text"}
                    </div>{" "}
                    <fieldset>
                      {" "}
                      <legend className={"pn-visually-hidden"}>
                        {"Selectgroup with icons and text"}
                      </legend>{" "}
                      <div className={"pn-form-selectgroup"}>
                        {" "}
                        <label className={"pn-form-selectgroup-item"}>
                          {" "}
                          <WorkspaceInput
                            type={"radio"}
                            name={"icons"}
                            defaultValue={"home"}
                            className={"pn-form-selectgroup-input"}
                            defaultChecked
                          />{" "}
                          <span className={"pn-form-selectgroup-label"}>
                            {" "}
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
                              className={"pn-icon pn-me-1"}
                            >
                              {" "}
                              <path d={"M5 12l-2 0l9 -9l9 9l-2 0"}></path>{" "}
                              <path
                                d={"M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7"}
                              ></path>{" "}
                              <path
                                d={"M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6"}
                              ></path>{" "}
                            </svg>
                            {" Home"}
                          </span>{" "}
                        </label>{" "}
                        <label className={"pn-form-selectgroup-item"}>
                          {" "}
                          <WorkspaceInput
                            type={"radio"}
                            name={"icons"}
                            defaultValue={"user"}
                            className={"pn-form-selectgroup-input"}
                          />{" "}
                          <span className={"pn-form-selectgroup-label"}>
                            {" "}
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
                              className={"pn-icon pn-me-1"}
                            >
                              {" "}
                              <path
                                d={"M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"}
                              ></path>{" "}
                              <path
                                d={"M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"}
                              ></path>{" "}
                            </svg>
                            {" User"}
                          </span>{" "}
                        </label>{" "}
                        <label className={"pn-form-selectgroup-item"}>
                          {" "}
                          <WorkspaceInput
                            type={"radio"}
                            name={"icons"}
                            defaultValue={"circle"}
                            className={"pn-form-selectgroup-input"}
                          />{" "}
                          <span className={"pn-form-selectgroup-label"}>
                            {" "}
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
                              className={"pn-icon pn-me-1"}
                            >
                              {" "}
                              <path
                                d={"M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"}
                              ></path>{" "}
                            </svg>
                            {" Circle"}
                          </span>{" "}
                        </label>{" "}
                        <label className={"pn-form-selectgroup-item"}>
                          {" "}
                          <WorkspaceInput
                            type={"radio"}
                            name={"icons"}
                            defaultValue={"square"}
                            className={"pn-form-selectgroup-input"}
                          />{" "}
                          <span className={"pn-form-selectgroup-label"}>
                            {" "}
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
                              className={"pn-icon pn-me-1"}
                            >
                              {" "}
                              <path
                                d={
                                  "M3 5a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-14"
                                }
                              ></path>{" "}
                            </svg>
                            {" Square"}
                          </span>{" "}
                        </label>{" "}
                      </div>{" "}
                    </fieldset>{" "}
                  </div>
                </div>
                <div className="form-workbench-example">
                  <div className={"pn-mb-3"}>
                    {" "}
                    <div className={"pn-form-label"}>
                      {"Different style"}
                    </div>{" "}
                    <fieldset>
                      {" "}
                      <legend className={"pn-visually-hidden"}>
                        {"Different style"}
                      </legend>{" "}
                      <div
                        className={
                          "pn-form-selectgroup pn-form-selectgroup-pills"
                        }
                      >
                        {" "}
                        <label className={"pn-form-selectgroup-item"}>
                          {" "}
                          <WorkspaceInput
                            type={"checkbox"}
                            name={"name"}
                            defaultValue={"HTML"}
                            className={"pn-form-selectgroup-input"}
                            defaultChecked
                          />{" "}
                          <span className={"pn-form-selectgroup-label"}>
                            {"HTML"}
                          </span>{" "}
                        </label>{" "}
                        <label className={"pn-form-selectgroup-item"}>
                          {" "}
                          <WorkspaceInput
                            type={"checkbox"}
                            name={"name"}
                            defaultValue={"CSS"}
                            className={"pn-form-selectgroup-input"}
                          />{" "}
                          <span className={"pn-form-selectgroup-label"}>
                            {"CSS"}
                          </span>{" "}
                        </label>{" "}
                        <label className={"pn-form-selectgroup-item"}>
                          {" "}
                          <WorkspaceInput
                            type={"checkbox"}
                            name={"name"}
                            defaultValue={"PHP"}
                            className={"pn-form-selectgroup-input"}
                          />{" "}
                          <span className={"pn-form-selectgroup-label"}>
                            {"PHP"}
                          </span>{" "}
                        </label>{" "}
                        <label className={"pn-form-selectgroup-item"}>
                          {" "}
                          <WorkspaceInput
                            type={"checkbox"}
                            name={"name"}
                            defaultValue={"JavaScript"}
                            className={"pn-form-selectgroup-input"}
                          />{" "}
                          <span className={"pn-form-selectgroup-label"}>
                            {"JavaScript"}
                          </span>{" "}
                        </label>{" "}
                      </div>{" "}
                    </fieldset>{" "}
                  </div>
                </div>
              </CardContent>
            </WorkspaceForm>
          </section>
          <section
            id="form-category-visual"
            className="form-workbench-section"
            hidden={category !== "visual"}
            aria-labelledby="form-title-visual"
          >
            <div className="form-workbench-section-heading">
              <div>
                <h2 id="form-title-visual">Choose by looking</h2>
                <p>Images, color swatches, and richer selection cards.</p>
              </div>
              <span>7 examples</span>
            </div>
            <WorkspaceForm className="pn-card form-workbench-card">
              <CardContent className="pn-card-body form-workbench-fields">
                <div className="form-workbench-example">
                  <div className={"pn-mb-3"}>
                    {" "}
                    <div className={"pn-form-label"}>{"Image Check"}</div>{" "}
                    <fieldset>
                      {" "}
                      <legend className={"pn-visually-hidden"}>
                        {"Image Check"}
                      </legend>{" "}
                      <div className={"pn-row pn-g-2"}>
                        {" "}
                        <div className={"pn-col-6 pn-col-sm-4"}>
                          {" "}
                          <label className={"pn-form-imagecheck pn-mb-2"}>
                            {" "}
                            <WorkspaceInput
                              name={"form-imagecheck"}
                              type={"checkbox"}
                              defaultValue={"1"}
                              className={"pn-form-imagecheck-input"}
                            />{" "}
                            <span className={"pn-form-imagecheck-figure"}>
                              {" "}
                              <img
                                src={"/assets/overtrue/coastal-center.png"}
                                alt={
                                  "Beautiful blonde woman relaxing with a can of coke on a tree stump by the beach"
                                }
                                className={"pn-form-imagecheck-image"}
                              />{" "}
                            </span>{" "}
                          </label>{" "}
                        </div>{" "}
                        <div className={"pn-col-6 pn-col-sm-4"}>
                          {" "}
                          <label className={"pn-form-imagecheck pn-mb-2"}>
                            {" "}
                            <WorkspaceInput
                              name={"form-imagecheck"}
                              type={"checkbox"}
                              defaultValue={"2"}
                              className={"pn-form-imagecheck-input"}
                              defaultChecked
                            />{" "}
                            <span className={"pn-form-imagecheck-figure"}>
                              {" "}
                              <img
                                src={"/assets/overtrue/project-12.svg"}
                                alt={
                                  "Brainstorming session with creative designers"
                                }
                                className={"pn-form-imagecheck-image"}
                              />{" "}
                            </span>{" "}
                          </label>{" "}
                        </div>{" "}
                        <div className={"pn-col-6 pn-col-sm-4"}>
                          {" "}
                          <label className={"pn-form-imagecheck pn-mb-2"}>
                            {" "}
                            <WorkspaceInput
                              name={"form-imagecheck"}
                              type={"checkbox"}
                              defaultValue={"3"}
                              className={"pn-form-imagecheck-input"}
                            />{" "}
                            <span className={"pn-form-imagecheck-figure"}>
                              {" "}
                              <img
                                src={"/assets/overtrue/material-study.png"}
                                alt={
                                  "Finances - US Dollars and Bitcoins - Currency - Money"
                                }
                                className={"pn-form-imagecheck-image"}
                              />{" "}
                            </span>{" "}
                          </label>{" "}
                        </div>{" "}
                        <div className={"pn-col-6 pn-col-sm-4"}>
                          {" "}
                          <label className={"pn-form-imagecheck pn-mb-2"}>
                            {" "}
                            <WorkspaceInput
                              name={"form-imagecheck"}
                              type={"checkbox"}
                              defaultValue={"4"}
                              className={"pn-form-imagecheck-input"}
                              defaultChecked
                            />{" "}
                            <span className={"pn-form-imagecheck-figure"}>
                              {" "}
                              <img
                                src={"/assets/overtrue/studio-space.png"}
                                alt={
                                  "Group of people brainstorming and taking notes"
                                }
                                className={"pn-form-imagecheck-image"}
                              />{" "}
                            </span>{" "}
                          </label>{" "}
                        </div>{" "}
                        <div className={"pn-col-6 pn-col-sm-4"}>
                          {" "}
                          <label className={"pn-form-imagecheck pn-mb-2"}>
                            {" "}
                            <WorkspaceInput
                              name={"form-imagecheck"}
                              type={"checkbox"}
                              defaultValue={"5"}
                              className={"pn-form-imagecheck-input"}
                            />{" "}
                            <span className={"pn-form-imagecheck-figure"}>
                              {" "}
                              <img
                                src={"/assets/overtrue/project-08.svg"}
                                alt={
                                  "Blue sofa with pillows in a designer living room interior"
                                }
                                className={"pn-form-imagecheck-image"}
                              />{" "}
                            </span>{" "}
                          </label>{" "}
                        </div>{" "}
                        <div className={"pn-col-6 pn-col-sm-4"}>
                          {" "}
                          <label className={"pn-form-imagecheck pn-mb-2"}>
                            {" "}
                            <WorkspaceInput
                              name={"form-imagecheck"}
                              type={"checkbox"}
                              defaultValue={"6"}
                              className={"pn-form-imagecheck-input"}
                            />{" "}
                            <span className={"pn-form-imagecheck-figure"}>
                              {" "}
                              <img
                                src={"/assets/overtrue/project-12.svg"}
                                alt={
                                  "Home office desk with Macbook, iPhone, calendar, watch & organizer"
                                }
                                className={"pn-form-imagecheck-image"}
                              />{" "}
                            </span>{" "}
                          </label>{" "}
                        </div>{" "}
                      </div>{" "}
                    </fieldset>{" "}
                  </div>
                </div>
                <div className="form-workbench-example">
                  <div className={"pn-mb-3"}>
                    {" "}
                    <div className={"pn-form-label"}>
                      {"Image Check Radio"}
                    </div>{" "}
                    <fieldset>
                      {" "}
                      <legend className={"pn-visually-hidden"}>
                        {"Image Check Radio"}
                      </legend>{" "}
                      <div className={"pn-row pn-g-2"}>
                        {" "}
                        <div className={"pn-col-6 pn-col-sm-4"}>
                          {" "}
                          <label className={"pn-form-imagecheck pn-mb-2"}>
                            {" "}
                            <WorkspaceInput
                              name={"form-imagecheck-radio"}
                              type={"radio"}
                              defaultValue={"1"}
                              className={"pn-form-imagecheck-input"}
                            />{" "}
                            <span className={"pn-form-imagecheck-figure"}>
                              {" "}
                              <img
                                src={"/assets/overtrue/material-study.png"}
                                alt={"Group of people sightseeing in the city"}
                                className={"pn-form-imagecheck-image"}
                              />{" "}
                            </span>{" "}
                          </label>{" "}
                        </div>{" "}
                        <div className={"pn-col-6 pn-col-sm-4"}>
                          {" "}
                          <label className={"pn-form-imagecheck pn-mb-2"}>
                            {" "}
                            <WorkspaceInput
                              name={"form-imagecheck-radio"}
                              type={"radio"}
                              defaultValue={"2"}
                              className={"pn-form-imagecheck-input"}
                              defaultChecked
                            />{" "}
                            <span className={"pn-form-imagecheck-figure"}>
                              {" "}
                              <img
                                src={"/assets/overtrue/studio-space.png"}
                                alt={
                                  "Color Palette Guide. Sample Colors Catalog."
                                }
                                className={"pn-form-imagecheck-image"}
                              />{" "}
                            </span>{" "}
                          </label>{" "}
                        </div>{" "}
                        <div className={"pn-col-6 pn-col-sm-4"}>
                          {" "}
                          <label className={"pn-form-imagecheck pn-mb-2"}>
                            {" "}
                            <WorkspaceInput
                              name={"form-imagecheck-radio"}
                              type={"radio"}
                              defaultValue={"3"}
                              className={"pn-form-imagecheck-input"}
                            />{" "}
                            <span className={"pn-form-imagecheck-figure"}>
                              {" "}
                              <img
                                src={"/assets/overtrue/material-study.png"}
                                alt={"Stylish workplace with computer at home"}
                                className={"pn-form-imagecheck-image"}
                              />{" "}
                            </span>{" "}
                          </label>{" "}
                        </div>{" "}
                        <div className={"pn-col-6 pn-col-sm-4"}>
                          {" "}
                          <label className={"pn-form-imagecheck pn-mb-2"}>
                            {" "}
                            <WorkspaceInput
                              name={"form-imagecheck-radio"}
                              type={"radio"}
                              defaultValue={"4"}
                              className={"pn-form-imagecheck-input"}
                            />{" "}
                            <span className={"pn-form-imagecheck-figure"}>
                              {" "}
                              <img
                                src={"/assets/overtrue/project-08.svg"}
                                alt={"Pink desk in the home office"}
                                className={"pn-form-imagecheck-image"}
                              />{" "}
                            </span>{" "}
                          </label>{" "}
                        </div>{" "}
                        <div className={"pn-col-6 pn-col-sm-4"}>
                          {" "}
                          <label className={"pn-form-imagecheck pn-mb-2"}>
                            {" "}
                            <WorkspaceInput
                              name={"form-imagecheck-radio"}
                              type={"radio"}
                              defaultValue={"5"}
                              className={"pn-form-imagecheck-input"}
                            />{" "}
                            <span className={"pn-form-imagecheck-figure"}>
                              {" "}
                              <img
                                src={"/assets/overtrue/studio-space.png"}
                                alt={
                                  "Young woman sitting on the sofa and working on her laptop"
                                }
                                className={"pn-form-imagecheck-image"}
                              />{" "}
                            </span>{" "}
                          </label>{" "}
                        </div>{" "}
                        <div className={"pn-col-6 pn-col-sm-4"}>
                          {" "}
                          <label className={"pn-form-imagecheck pn-mb-2"}>
                            {" "}
                            <WorkspaceInput
                              name={"form-imagecheck-radio"}
                              type={"radio"}
                              defaultValue={"6"}
                              className={"pn-form-imagecheck-input"}
                            />{" "}
                            <span className={"pn-form-imagecheck-figure"}>
                              {" "}
                              <img
                                src={"/assets/overtrue/project-04.svg"}
                                alt={"Coffee on a table with other items"}
                                className={"pn-form-imagecheck-image"}
                              />{" "}
                            </span>{" "}
                          </label>{" "}
                        </div>{" "}
                      </div>{" "}
                    </fieldset>{" "}
                  </div>
                </div>
                <div className="form-workbench-example">
                  <div className={"pn-mb-3"}>
                    {" "}
                    <div className={"pn-form-label"}>
                      {"Color Input Check"}
                    </div>{" "}
                    <fieldset>
                      {" "}
                      <legend className={"pn-visually-hidden"}>
                        {"Color Input Check"}
                      </legend>{" "}
                      <div className={"pn-row pn-g-2"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <label className={"pn-form-colorinput"}>
                            {" "}
                            <WorkspaceInput
                              name={"color"}
                              type={"checkbox"}
                              defaultValue={"dark"}
                              className={"pn-form-colorinput-input"}
                              aria-label={"dark"}
                            />{" "}
                            <span
                              className={"pn-form-colorinput-color pn-bg-dark"}
                            ></span>{" "}
                          </label>{" "}
                        </div>{" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <label
                            className={
                              "pn-form-colorinput pn-form-colorinput-light"
                            }
                          >
                            {" "}
                            <WorkspaceInput
                              name={"color"}
                              type={"checkbox"}
                              defaultValue={"white"}
                              className={"pn-form-colorinput-input"}
                              defaultChecked
                              aria-label={"white"}
                            />{" "}
                            <span
                              className={"pn-form-colorinput-color pn-bg-white"}
                            ></span>{" "}
                          </label>{" "}
                        </div>{" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <label className={"pn-form-colorinput"}>
                            {" "}
                            <WorkspaceInput
                              name={"color"}
                              type={"checkbox"}
                              defaultValue={"blue"}
                              className={"pn-form-colorinput-input"}
                              aria-label={"blue"}
                            />{" "}
                            <span
                              className={"pn-form-colorinput-color pn-bg-blue"}
                            ></span>{" "}
                          </label>{" "}
                        </div>{" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <label className={"pn-form-colorinput"}>
                            {" "}
                            <WorkspaceInput
                              name={"color"}
                              type={"checkbox"}
                              defaultValue={"azure"}
                              className={"pn-form-colorinput-input"}
                              aria-label={"azure"}
                            />{" "}
                            <span
                              className={"pn-form-colorinput-color pn-bg-azure"}
                            ></span>{" "}
                          </label>{" "}
                        </div>{" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <label className={"pn-form-colorinput"}>
                            {" "}
                            <WorkspaceInput
                              name={"color"}
                              type={"checkbox"}
                              defaultValue={"indigo"}
                              className={"pn-form-colorinput-input"}
                              aria-label={"indigo"}
                            />{" "}
                            <span
                              className={
                                "pn-form-colorinput-color pn-bg-indigo"
                              }
                            ></span>{" "}
                          </label>{" "}
                        </div>{" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <label className={"pn-form-colorinput"}>
                            {" "}
                            <WorkspaceInput
                              name={"color"}
                              type={"checkbox"}
                              defaultValue={"purple"}
                              className={"pn-form-colorinput-input"}
                              aria-label={"purple"}
                            />{" "}
                            <span
                              className={
                                "pn-form-colorinput-color pn-bg-purple"
                              }
                            ></span>{" "}
                          </label>{" "}
                        </div>{" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <label className={"pn-form-colorinput"}>
                            {" "}
                            <WorkspaceInput
                              name={"color"}
                              type={"checkbox"}
                              defaultValue={"pink"}
                              className={"pn-form-colorinput-input"}
                              aria-label={"pink"}
                            />{" "}
                            <span
                              className={"pn-form-colorinput-color pn-bg-pink"}
                            ></span>{" "}
                          </label>{" "}
                        </div>{" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <label className={"pn-form-colorinput"}>
                            {" "}
                            <WorkspaceInput
                              name={"color"}
                              type={"checkbox"}
                              defaultValue={"red"}
                              className={"pn-form-colorinput-input"}
                              aria-label={"red"}
                            />{" "}
                            <span
                              className={"pn-form-colorinput-color pn-bg-red"}
                            ></span>{" "}
                          </label>{" "}
                        </div>{" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <label className={"pn-form-colorinput"}>
                            {" "}
                            <WorkspaceInput
                              name={"color"}
                              type={"checkbox"}
                              defaultValue={"orange"}
                              className={"pn-form-colorinput-input"}
                              aria-label={"orange"}
                            />{" "}
                            <span
                              className={
                                "pn-form-colorinput-color pn-bg-orange"
                              }
                            ></span>{" "}
                          </label>{" "}
                        </div>{" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <label className={"pn-form-colorinput"}>
                            {" "}
                            <WorkspaceInput
                              name={"color"}
                              type={"checkbox"}
                              defaultValue={"yellow"}
                              className={"pn-form-colorinput-input"}
                              aria-label={"yellow"}
                            />{" "}
                            <span
                              className={
                                "pn-form-colorinput-color pn-bg-yellow"
                              }
                            ></span>{" "}
                          </label>{" "}
                        </div>{" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <label className={"pn-form-colorinput"}>
                            {" "}
                            <WorkspaceInput
                              name={"color"}
                              type={"checkbox"}
                              defaultValue={"lime"}
                              className={"pn-form-colorinput-input"}
                              aria-label={"lime"}
                            />{" "}
                            <span
                              className={"pn-form-colorinput-color pn-bg-lime"}
                            ></span>{" "}
                          </label>{" "}
                        </div>{" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <label className={"pn-form-colorinput"}>
                            {" "}
                            <WorkspaceInput
                              name={"color"}
                              type={"checkbox"}
                              defaultValue={"green"}
                              className={"pn-form-colorinput-input"}
                              aria-label={"green"}
                            />{" "}
                            <span
                              className={"pn-form-colorinput-color pn-bg-green"}
                            ></span>{" "}
                          </label>{" "}
                        </div>{" "}
                      </div>{" "}
                    </fieldset>{" "}
                  </div>
                </div>
                <div className="form-workbench-example">
                  <div className={"pn-mb-3"}>
                    {" "}
                    <div className={"pn-form-label"}>
                      {"Color Input Radio"}
                    </div>{" "}
                    <fieldset>
                      {" "}
                      <legend className={"pn-visually-hidden"}>
                        {"Color Input Radio"}
                      </legend>{" "}
                      <div className={"pn-row pn-g-2"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <label className={"pn-form-colorinput"}>
                            {" "}
                            <WorkspaceInput
                              name={"color-rounded"}
                              type={"radio"}
                              defaultValue={"dark"}
                              className={"pn-form-colorinput-input"}
                              aria-label={"dark"}
                            />{" "}
                            <span
                              className={
                                "pn-form-colorinput-color pn-bg-dark pn-rounded-circle"
                              }
                            ></span>{" "}
                          </label>{" "}
                        </div>{" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <label
                            className={
                              "pn-form-colorinput pn-form-colorinput-light"
                            }
                          >
                            {" "}
                            <WorkspaceInput
                              name={"color-rounded"}
                              type={"radio"}
                              defaultValue={"white"}
                              className={"pn-form-colorinput-input"}
                              defaultChecked
                              aria-label={"white"}
                            />{" "}
                            <span
                              className={
                                "pn-form-colorinput-color pn-bg-white pn-rounded-circle"
                              }
                            ></span>{" "}
                          </label>{" "}
                        </div>{" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <label className={"pn-form-colorinput"}>
                            {" "}
                            <WorkspaceInput
                              name={"color-rounded"}
                              type={"radio"}
                              defaultValue={"blue"}
                              className={"pn-form-colorinput-input"}
                              aria-label={"blue"}
                            />{" "}
                            <span
                              className={
                                "pn-form-colorinput-color pn-bg-blue pn-rounded-circle"
                              }
                            ></span>{" "}
                          </label>{" "}
                        </div>{" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <label className={"pn-form-colorinput"}>
                            {" "}
                            <WorkspaceInput
                              name={"color-rounded"}
                              type={"radio"}
                              defaultValue={"azure"}
                              className={"pn-form-colorinput-input"}
                              aria-label={"azure"}
                            />{" "}
                            <span
                              className={
                                "pn-form-colorinput-color pn-bg-azure pn-rounded-circle"
                              }
                            ></span>{" "}
                          </label>{" "}
                        </div>{" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <label className={"pn-form-colorinput"}>
                            {" "}
                            <WorkspaceInput
                              name={"color-rounded"}
                              type={"radio"}
                              defaultValue={"indigo"}
                              className={"pn-form-colorinput-input"}
                              aria-label={"indigo"}
                            />{" "}
                            <span
                              className={
                                "pn-form-colorinput-color pn-bg-indigo pn-rounded-circle"
                              }
                            ></span>{" "}
                          </label>{" "}
                        </div>{" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <label className={"pn-form-colorinput"}>
                            {" "}
                            <WorkspaceInput
                              name={"color-rounded"}
                              type={"radio"}
                              defaultValue={"purple"}
                              className={"pn-form-colorinput-input"}
                              aria-label={"purple"}
                            />{" "}
                            <span
                              className={
                                "pn-form-colorinput-color pn-bg-purple pn-rounded-circle"
                              }
                            ></span>{" "}
                          </label>{" "}
                        </div>{" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <label className={"pn-form-colorinput"}>
                            {" "}
                            <WorkspaceInput
                              name={"color-rounded"}
                              type={"radio"}
                              defaultValue={"pink"}
                              className={"pn-form-colorinput-input"}
                              aria-label={"pink"}
                            />{" "}
                            <span
                              className={
                                "pn-form-colorinput-color pn-bg-pink pn-rounded-circle"
                              }
                            ></span>{" "}
                          </label>{" "}
                        </div>{" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <label className={"pn-form-colorinput"}>
                            {" "}
                            <WorkspaceInput
                              name={"color-rounded"}
                              type={"radio"}
                              defaultValue={"red"}
                              className={"pn-form-colorinput-input"}
                              aria-label={"red"}
                            />{" "}
                            <span
                              className={
                                "pn-form-colorinput-color pn-bg-red pn-rounded-circle"
                              }
                            ></span>{" "}
                          </label>{" "}
                        </div>{" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <label className={"pn-form-colorinput"}>
                            {" "}
                            <WorkspaceInput
                              name={"color-rounded"}
                              type={"radio"}
                              defaultValue={"orange"}
                              className={"pn-form-colorinput-input"}
                              aria-label={"orange"}
                            />{" "}
                            <span
                              className={
                                "pn-form-colorinput-color pn-bg-orange pn-rounded-circle"
                              }
                            ></span>{" "}
                          </label>{" "}
                        </div>{" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <label className={"pn-form-colorinput"}>
                            {" "}
                            <WorkspaceInput
                              name={"color-rounded"}
                              type={"radio"}
                              defaultValue={"yellow"}
                              className={"pn-form-colorinput-input"}
                              aria-label={"yellow"}
                            />{" "}
                            <span
                              className={
                                "pn-form-colorinput-color pn-bg-yellow pn-rounded-circle"
                              }
                            ></span>{" "}
                          </label>{" "}
                        </div>{" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <label className={"pn-form-colorinput"}>
                            {" "}
                            <WorkspaceInput
                              name={"color-rounded"}
                              type={"radio"}
                              defaultValue={"lime"}
                              className={"pn-form-colorinput-input"}
                              aria-label={"lime"}
                            />{" "}
                            <span
                              className={
                                "pn-form-colorinput-color pn-bg-lime pn-rounded-circle"
                              }
                            ></span>{" "}
                          </label>{" "}
                        </div>{" "}
                        <div className={"pn-col-auto"}>
                          {" "}
                          <label className={"pn-form-colorinput"}>
                            {" "}
                            <WorkspaceInput
                              name={"color-rounded"}
                              type={"radio"}
                              defaultValue={"green"}
                              className={"pn-form-colorinput-input"}
                              aria-label={"green"}
                            />{" "}
                            <span
                              className={
                                "pn-form-colorinput-color pn-bg-green pn-rounded-circle"
                              }
                            ></span>{" "}
                          </label>{" "}
                        </div>{" "}
                      </div>{" "}
                    </fieldset>{" "}
                  </div>
                </div>
                <div className="form-workbench-example">
                  <div className={"pn-mb-3"}>
                    {" "}
                    <label
                      className={"pn-form-label"}
                      htmlFor={"fe3-color-picker"}
                    >
                      {" Color picker "}
                    </label>{" "}
                    <WorkspaceInput
                      type={"color"}
                      id={"fe3-color-picker"}
                      className={"pn-form-control pn-form-control-color"}
                      defaultValue={"#066fd1"}
                      title={"Choose your color"}
                    />{" "}
                  </div>
                </div>
                <div className="form-workbench-example">
                  <div className={"pn-mb-3"}>
                    {" "}
                    <div className={"pn-form-label"}>
                      {"Payment method"}
                    </div>{" "}
                    <fieldset>
                      {" "}
                      <legend className={"pn-visually-hidden"}>
                        {"Payment method"}
                      </legend>{" "}
                      <div
                        className={
                          "pn-form-selectgroup pn-form-selectgroup-boxes pn-d-flex pn-flex-column"
                        }
                      >
                        {" "}
                        <label
                          className={"pn-form-selectgroup-item pn-flex-fill"}
                        >
                          {" "}
                          <WorkspaceInput
                            type={"radio"}
                            name={"form-payment"}
                            defaultValue={"visa"}
                            className={"pn-form-selectgroup-input"}
                          />{" "}
                          <div
                            className={
                              "pn-form-selectgroup-label pn-d-flex pn-align-items-center pn-p-3"
                            }
                          >
                            {" "}
                            <div className={"pn-me-3"}>
                              {" "}
                              <span
                                className={"pn-form-selectgroup-check"}
                              ></span>{" "}
                            </div>{" "}
                            <div>
                              {" "}
                              <span
                                className={
                                  "pn-payment pn-payment-provider-visa pn-payment-xs pn-me-2"
                                }
                              ></span>
                              {" ending in "}
                              <strong>{"7998"}</strong>{" "}
                            </div>{" "}
                          </div>{" "}
                        </label>{" "}
                        <label
                          className={"pn-form-selectgroup-item pn-flex-fill"}
                        >
                          {" "}
                          <WorkspaceInput
                            type={"radio"}
                            name={"form-payment"}
                            defaultValue={"mastercard"}
                            className={"pn-form-selectgroup-input"}
                            defaultChecked
                          />{" "}
                          <div
                            className={
                              "pn-form-selectgroup-label pn-d-flex pn-align-items-center pn-p-3"
                            }
                          >
                            {" "}
                            <div className={"pn-me-3"}>
                              {" "}
                              <span
                                className={"pn-form-selectgroup-check"}
                              ></span>{" "}
                            </div>{" "}
                            <div>
                              {" "}
                              <span
                                className={
                                  "pn-payment pn-payment-provider-mastercard pn-payment-xs pn-me-2"
                                }
                              ></span>
                              {" ending in "}
                              <strong>{"1000"}</strong>{" "}
                            </div>{" "}
                          </div>{" "}
                        </label>{" "}
                        <label
                          className={"pn-form-selectgroup-item pn-flex-fill"}
                        >
                          {" "}
                          <WorkspaceInput
                            type={"radio"}
                            name={"form-payment"}
                            defaultValue={"paypal"}
                            className={"pn-form-selectgroup-input"}
                          />{" "}
                          <div
                            className={
                              "pn-form-selectgroup-label pn-d-flex pn-align-items-center pn-p-3"
                            }
                          >
                            {" "}
                            <div className={"pn-me-3"}>
                              {" "}
                              <span
                                className={"pn-form-selectgroup-check"}
                              ></span>{" "}
                            </div>{" "}
                            <div>
                              {" "}
                              <span
                                className={
                                  "pn-payment pn-payment-provider-paypal pn-payment-xs pn-me-2"
                                }
                              ></span>{" "}
                            </div>{" "}
                          </div>{" "}
                        </label>{" "}
                      </div>{" "}
                    </fieldset>{" "}
                  </div>
                </div>
                <div className="form-workbench-example is-people">
                  <div className={"pn-mb-3"}>
                    {" "}
                    <div className={"pn-form-label"}>
                      {"Project Manager"}
                    </div>{" "}
                    <fieldset>
                      {" "}
                      <legend className={"pn-visually-hidden"}>
                        {"Project Manager"}
                      </legend>{" "}
                      <div
                        className={
                          "pn-form-selectgroup pn-form-selectgroup-boxes pn-d-flex pn-flex-column"
                        }
                      >
                        {" "}
                        <label
                          className={"pn-form-selectgroup-item pn-flex-fill"}
                        >
                          {" "}
                          <WorkspaceInput
                            type={"checkbox"}
                            name={"form-project-manager[]"}
                            defaultValue={"1"}
                            className={"pn-form-selectgroup-input"}
                          />{" "}
                          <div
                            className={
                              "pn-form-selectgroup-label pn-d-flex pn-align-items-center pn-p-3"
                            }
                          >
                            {" "}
                            <div className={"pn-me-3"}>
                              {" "}
                              <span
                                className={"pn-form-selectgroup-check"}
                              ></span>{" "}
                            </div>{" "}
                            <div
                              className={
                                "pn-form-selectgroup-label-content pn-d-flex pn-align-items-center"
                              }
                            >
                              {" "}
                              <span
                                style={
                                  {
                                    backgroundImage:
                                      "url(/assets/overtrue/people/leo.svg)",
                                  } as CSSProperties
                                }
                                className={"pn-avatar pn-me-3"}
                              ></span>{" "}
                              <div>
                                {" "}
                                <div className={"pn-fw-medium"}>
                                  {"Maya Okafor"}
                                </div>{" "}
                                <div className={"pn-text-secondary"}>
                                  {"UI Designer"}
                                </div>{" "}
                              </div>{" "}
                            </div>{" "}
                          </div>{" "}
                        </label>{" "}
                        <label
                          className={"pn-form-selectgroup-item pn-flex-fill"}
                        >
                          {" "}
                          <WorkspaceInput
                            type={"checkbox"}
                            name={"form-project-manager[]"}
                            defaultValue={"2"}
                            className={"pn-form-selectgroup-input"}
                            defaultChecked
                          />{" "}
                          <div
                            className={
                              "pn-form-selectgroup-label pn-d-flex pn-align-items-center pn-p-3"
                            }
                          >
                            {" "}
                            <div className={"pn-me-3"}>
                              {" "}
                              <span
                                className={"pn-form-selectgroup-check"}
                              ></span>{" "}
                            </div>{" "}
                            <div
                              className={
                                "pn-form-selectgroup-label-content pn-d-flex pn-align-items-center"
                              }
                            >
                              {" "}
                              <span
                                style={
                                  {
                                    backgroundImage:
                                      "url(/assets/overtrue/people/maya.svg)",
                                  } as CSSProperties
                                }
                                className={"pn-avatar pn-me-3"}
                              ></span>{" "}
                              <div>
                                {" "}
                                <div className={"pn-fw-medium"}>
                                  {"Samir Haddad"}
                                </div>{" "}
                                <div className={"pn-text-secondary"}>
                                  {"Chemical Engineer"}
                                </div>{" "}
                              </div>{" "}
                            </div>{" "}
                          </div>{" "}
                        </label>{" "}
                        <label
                          className={"pn-form-selectgroup-item pn-flex-fill"}
                        >
                          {" "}
                          <WorkspaceInput
                            type={"checkbox"}
                            name={"form-project-manager[]"}
                            defaultValue={"3"}
                            className={"pn-form-selectgroup-input"}
                          />{" "}
                          <div
                            className={
                              "pn-form-selectgroup-label pn-d-flex pn-align-items-center pn-p-3"
                            }
                          >
                            {" "}
                            <div className={"pn-me-3"}>
                              {" "}
                              <span
                                className={"pn-form-selectgroup-check"}
                              ></span>{" "}
                            </div>{" "}
                            <div
                              className={
                                "pn-form-selectgroup-label-content pn-d-flex pn-align-items-center"
                              }
                            >
                              {" "}
                              <span
                                style={
                                  {
                                    backgroundImage:
                                      "url(/assets/overtrue/people/june.svg)",
                                  } as CSSProperties
                                }
                                className={"pn-avatar pn-me-3"}
                              ></span>{" "}
                              <div>
                                {" "}
                                <div className={"pn-fw-medium"}>
                                  {"Ines Duarte"}
                                </div>{" "}
                                <div className={"pn-text-secondary"}>
                                  {"Geologist IV"}
                                </div>{" "}
                              </div>{" "}
                            </div>{" "}
                          </div>{" "}
                        </label>{" "}
                        <label
                          className={"pn-form-selectgroup-item pn-flex-fill"}
                        >
                          {" "}
                          <WorkspaceInput
                            type={"checkbox"}
                            name={"form-project-manager[]"}
                            defaultValue={"4"}
                            className={"pn-form-selectgroup-input"}
                          />{" "}
                          <div
                            className={
                              "pn-form-selectgroup-label pn-d-flex pn-align-items-center pn-p-3"
                            }
                          >
                            {" "}
                            <div className={"pn-me-3"}>
                              {" "}
                              <span
                                className={"pn-form-selectgroup-check"}
                              ></span>{" "}
                            </div>{" "}
                            <div
                              className={
                                "pn-form-selectgroup-label-content pn-d-flex pn-align-items-center"
                              }
                            >
                              {" "}
                              <span
                                style={
                                  {
                                    backgroundImage:
                                      "url(/assets/overtrue/people/tomas.svg)",
                                  } as CSSProperties
                                }
                                className={"pn-avatar pn-me-3"}
                              ></span>{" "}
                              <div>
                                {" "}
                                <div className={"pn-fw-medium"}>
                                  {"Alina Petrova"}
                                </div>{" "}
                                <div className={"pn-text-secondary"}>
                                  {"Research Nurse"}
                                </div>{" "}
                              </div>{" "}
                            </div>{" "}
                          </div>{" "}
                        </label>{" "}
                        <label
                          className={"pn-form-selectgroup-item pn-flex-fill"}
                        >
                          {" "}
                          <WorkspaceInput
                            type={"checkbox"}
                            name={"form-project-manager[]"}
                            defaultValue={"5"}
                            className={"pn-form-selectgroup-input"}
                          />{" "}
                          <div
                            className={
                              "pn-form-selectgroup-label pn-d-flex pn-align-items-center pn-p-3"
                            }
                          >
                            {" "}
                            <div className={"pn-me-3"}>
                              {" "}
                              <span
                                className={"pn-form-selectgroup-check"}
                              ></span>{" "}
                            </div>{" "}
                            <div
                              className={
                                "pn-form-selectgroup-label-content pn-d-flex pn-align-items-center"
                              }
                            >
                              {" "}
                              <span
                                style={
                                  {
                                    backgroundImage:
                                      "url(/assets/overtrue/people/maya.svg)",
                                  } as CSSProperties
                                }
                                className={"pn-avatar pn-me-3"}
                              ></span>{" "}
                              <div>
                                {" "}
                                <div className={"pn-fw-medium"}>
                                  {"Nora Jensen"}
                                </div>{" "}
                                <div className={"pn-text-secondary"}>
                                  {"VP Product Management"}
                                </div>{" "}
                              </div>{" "}
                            </div>{" "}
                          </div>{" "}
                        </label>{" "}
                      </div>{" "}
                    </fieldset>{" "}
                  </div>
                </div>
              </CardContent>
            </WorkspaceForm>
          </section>
          <section
            id="form-category-groups"
            className="form-workbench-section"
            hidden={category !== "groups"}
            aria-labelledby="form-title-groups"
          >
            <div className="form-workbench-section-heading">
              <div>
                <h2 id="form-title-groups">A little more context</h2>
                <p>
                  Pair an input with a prefix, a shortcut, or a useful action.
                </p>
              </div>
              <span>13 examples</span>
            </div>
            <WorkspaceForm className="pn-card form-workbench-card">
              <CardContent className="pn-card-body form-workbench-fields">
                <div className="form-workbench-example">
                  <div className={"pn-mb-3"}>
                    {" "}
                    <div className={"pn-form-label"}>{"Icon input"}</div>{" "}
                    <div className={"pn-input-icon pn-mb-3"}>
                      {" "}
                      <WorkspaceInput
                        type={"text"}
                        defaultValue={""}
                        className={"pn-form-control"}
                        placeholder={"Search…"}
                      />{" "}
                      <span className={"pn-input-icon-addon"}>
                        {" "}
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
                          className={"pn-icon"}
                        >
                          {" "}
                          <path
                            d={"M3 10a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"}
                          ></path>{" "}
                          <path d={"M21 21l-6 -6"}></path>{" "}
                        </svg>{" "}
                      </span>{" "}
                    </div>{" "}
                    <div className={"pn-input-icon pn-mb-3"}>
                      {" "}
                      <span className={"pn-input-icon-addon"}>
                        {" "}
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
                          className={"pn-icon"}
                        >
                          {" "}
                          <path
                            d={"M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"}
                          ></path>{" "}
                          <path
                            d={"M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"}
                          ></path>{" "}
                        </svg>{" "}
                      </span>{" "}
                      <WorkspaceInput
                        type={"text"}
                        defaultValue={""}
                        className={"pn-form-control"}
                        placeholder={"Username"}
                      />{" "}
                    </div>{" "}
                  </div>
                </div>
                <div className="form-workbench-example">
                  <div className={"pn-mb-3"}>
                    {" "}
                    <div className={"pn-form-label"}>{"Loader input"}</div>{" "}
                    <div className={"pn-input-icon pn-mb-3"}>
                      {" "}
                      <WorkspaceInput
                        type={"text"}
                        defaultValue={""}
                        className={"pn-form-control"}
                        placeholder={"Loading…"}
                      />{" "}
                      <span className={"pn-input-icon-addon"}>
                        {" "}
                        <div
                          className={
                            "pn-spinner-border pn-spinner-border-sm pn-text-secondary"
                          }
                          role={"status"}
                        ></div>{" "}
                      </span>{" "}
                    </div>{" "}
                    <div className={"pn-input-icon pn-mb-3"}>
                      {" "}
                      <span className={"pn-input-icon-addon"}>
                        {" "}
                        <div
                          className={
                            "pn-spinner-border pn-spinner-border-sm pn-text-secondary"
                          }
                          role={"status"}
                        ></div>{" "}
                      </span>{" "}
                      <WorkspaceInput
                        type={"text"}
                        defaultValue={""}
                        className={"pn-form-control"}
                        placeholder={"Loading…"}
                      />{" "}
                    </div>{" "}
                  </div>
                </div>
                <div className="form-workbench-example">
                  <div className={"pn-mb-3"}>
                    {" "}
                    <div className={"pn-form-label"}>{"Input group"}</div>{" "}
                    <div className={"pn-input-group pn-mb-2"}>
                      {" "}
                      <WorkspaceInput
                        type={"text"}
                        className={"pn-form-control"}
                        placeholder={"Search for…"}
                      />{" "}
                      <WorkspaceButton className={"pn-btn"} type={"button"}>
                        {"Go!"}
                      </WorkspaceButton>{" "}
                    </div>{" "}
                    <WorkspaceDropdown className={"pn-input-group"}>
                      {" "}
                      <WorkspaceDropdownTrigger
                        type={"button"}
                        className={"pn-btn pn-dropdown-toggle"}
                        aria-haspopup={"true"}
                      >
                        {"Action"}
                      </WorkspaceDropdownTrigger>{" "}
                      <WorkspaceDropdownContent className={"pn-dropdown-menu"}>
                        {" "}
                        <WorkspaceDropdownItem
                          className={"pn-dropdown-item"}
                          href={"#"}
                        >
                          {" Action "}
                        </WorkspaceDropdownItem>{" "}
                        <WorkspaceDropdownItem
                          className={"pn-dropdown-item"}
                          href={"#"}
                        >
                          {" Another action "}
                        </WorkspaceDropdownItem>{" "}
                      </WorkspaceDropdownContent>{" "}
                      <WorkspaceInput
                        type={"text"}
                        className={"pn-form-control"}
                        aria-label={"Text input with dropdown button"}
                      />{" "}
                    </WorkspaceDropdown>{" "}
                  </div>
                </div>
                <div className="form-workbench-example">
                  <div className={"pn-mb-3"}>
                    {" "}
                    <label
                      className={"pn-form-label"}
                      htmlFor={"fe1-input-group-buttons"}
                    >
                      {" Input group buttons "}
                    </label>{" "}
                    <WorkspaceDropdown className={"pn-input-group"}>
                      {" "}
                      <WorkspaceInput
                        type={"text"}
                        className={"pn-form-control"}
                        id={"fe1-input-group-buttons"}
                      />{" "}
                      <WorkspaceButton type={"button"} className={"pn-btn"}>
                        {"Action"}
                      </WorkspaceButton>{" "}
                      <WorkspaceDropdownTrigger
                        type={"button"}
                        className={
                          "pn-btn pn-dropdown-toggle pn-dropdown-toggle-split"
                        }
                        aria-label="More input actions"
                      ></WorkspaceDropdownTrigger>{" "}
                      <WorkspaceDropdownContent
                        className={"pn-dropdown-menu pn-dropdown-menu-end"}
                      >
                        {" "}
                        <WorkspaceDropdownItem
                          className={"pn-dropdown-item"}
                          href={"#"}
                        >
                          {" Action "}
                        </WorkspaceDropdownItem>{" "}
                        <WorkspaceDropdownItem
                          className={"pn-dropdown-item"}
                          href={"#"}
                        >
                          {" Another action "}
                        </WorkspaceDropdownItem>{" "}
                      </WorkspaceDropdownContent>{" "}
                    </WorkspaceDropdown>{" "}
                  </div>
                </div>
                <div className="form-workbench-example">
                  <div className={"pn-mb-3"}>
                    {" "}
                    <label
                      className={"pn-form-label"}
                      htmlFor={"fe1-separated-input"}
                    >
                      {" Separated inputs "}
                    </label>{" "}
                    <div className={"pn-row pn-g-2"}>
                      {" "}
                      <div className={"pn-col"}>
                        {" "}
                        <WorkspaceInput
                          type={"text"}
                          className={"pn-form-control"}
                          id={"fe1-separated-input"}
                          placeholder={"Search for…"}
                        />{" "}
                      </div>{" "}
                      <div className={"pn-col-auto"}>
                        {" "}
                        <WorkspaceButton
                          href={"#"}
                          className={"pn-btn pn-btn-icon"}
                          aria-label={"Button"}
                        >
                          {" "}
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
                            className={"pn-icon"}
                          >
                            {" "}
                            <path
                              d={"M3 10a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"}
                            ></path>{" "}
                            <path d={"M21 21l-6 -6"}></path>{" "}
                          </svg>{" "}
                        </WorkspaceButton>{" "}
                      </div>{" "}
                    </div>{" "}
                  </div>
                </div>
                <div className="form-workbench-example">
                  <div className={"pn-mb-3"}>
                    {" "}
                    <label
                      className={"pn-form-label"}
                      htmlFor={"fe1-help-icon-input"}
                    >
                      {" Input with help icon "}
                    </label>{" "}
                    <div className={"pn-row pn-g-2"}>
                      {" "}
                      <div className={"pn-col"}>
                        {" "}
                        <WorkspaceInput
                          type={"text"}
                          className={"pn-form-control"}
                          id={"fe1-help-icon-input"}
                          placeholder={"Search for…"}
                        />{" "}
                      </div>{" "}
                      <div className={"pn-col-auto pn-align-self-center"}>
                        {" "}
                        <span className={"pn-form-help"}>{"?"}</span>{" "}
                      </div>{" "}
                    </div>{" "}
                  </div>
                </div>
                <div className="form-workbench-example">
                  <div className={"pn-mb-3"}>
                    {" "}
                    <div className={"pn-form-label"}>{"Input group"}</div>{" "}
                    <div className={"pn-input-group pn-mb-2"}>
                      {" "}
                      <span className={"pn-input-group-text"}>{"@"}</span>{" "}
                      <WorkspaceInput
                        type={"text"}
                        className={"pn-form-control"}
                        placeholder={"username"}
                        autoComplete={"off"}
                      />{" "}
                    </div>{" "}
                    <div className={"pn-input-group pn-mb-2"}>
                      {" "}
                      <WorkspaceInput
                        type={"text"}
                        className={"pn-form-control"}
                        placeholder={"subdomain"}
                        autoComplete={"off"}
                      />{" "}
                      <span className={"pn-input-group-text"}>
                        {".overtrue.example"}
                      </span>{" "}
                    </div>{" "}
                    <div className={"pn-input-group"}>
                      {" "}
                      <span className={"pn-input-group-text"}>
                        {"https://"}
                      </span>{" "}
                      <WorkspaceInput
                        type={"text"}
                        className={"pn-form-control"}
                        placeholder={"subdomain"}
                        autoComplete={"off"}
                      />{" "}
                      <span className={"pn-input-group-text"}>
                        {".overtrue.example"}
                      </span>{" "}
                    </div>{" "}
                  </div>
                </div>
                <div className="form-workbench-example">
                  <div className={"pn-mb-3"}>
                    {" "}
                    <div className={"pn-form-label"}>
                      {"Input with checkbox or radios"}
                    </div>{" "}
                    <div className={"pn-input-group pn-mb-2"}>
                      {" "}
                      <span className={"pn-input-group-text"}>
                        {" "}
                        <WorkspaceInput
                          className={"pn-form-check-input pn-m-0"}
                          type={"checkbox"}
                          defaultChecked
                        />{" "}
                      </span>{" "}
                      <WorkspaceInput
                        type={"text"}
                        className={"pn-form-control"}
                        autoComplete={"off"}
                      />{" "}
                    </div>{" "}
                    <div className={"pn-input-group"}>
                      {" "}
                      <WorkspaceInput
                        type={"text"}
                        className={"pn-form-control"}
                        autoComplete={"off"}
                      />{" "}
                      <span className={"pn-input-group-text"}>
                        {" "}
                        <WorkspaceInput
                          className={"pn-form-check-input pn-m-0"}
                          type={"radio"}
                          defaultChecked
                        />{" "}
                      </span>{" "}
                    </div>{" "}
                  </div>
                </div>
                <div className="form-workbench-example">
                  <div className={"pn-mb-3"}>
                    {" "}
                    <label
                      className={"pn-form-label"}
                      htmlFor={"fe2-prepended-text"}
                    >
                      {" Input with prepended text "}
                    </label>{" "}
                    <div className={"pn-input-group pn-input-group-flat"}>
                      {" "}
                      <span className={"pn-input-group-text"}>
                        {"/docs"}
                      </span>{" "}
                      <WorkspaceInput
                        type={"text"}
                        className={"pn-form-control pn-ps-0"}
                        id={"fe2-prepended-text"}
                        defaultValue={"yourfancyusername"}
                        autoComplete={"off"}
                      />{" "}
                    </div>{" "}
                  </div>
                </div>
                <div className="form-workbench-example">
                  <div className={"pn-mb-3"}>
                    {" "}
                    <label
                      className={"pn-form-label"}
                      htmlFor={"fe2-appended-text"}
                    >
                      {" Input with appended text "}
                    </label>{" "}
                    <div className={"pn-input-group pn-input-group-flat"}>
                      {" "}
                      <WorkspaceInput
                        type={"text"}
                        className={"pn-form-control pn-text-end pn-pe-0"}
                        id={"fe2-appended-text"}
                        defaultValue={"yourfancydomain"}
                        autoComplete={"off"}
                      />{" "}
                      <span className={"pn-input-group-text"}>
                        {".overtrue.example"}
                      </span>{" "}
                    </div>{" "}
                  </div>
                </div>
                <div className="form-workbench-example">
                  <div className={"pn-mb-3"}>
                    {" "}
                    <label
                      className={"pn-form-label"}
                      htmlFor={"fe2-appended-link"}
                    >
                      {" Input with appended link "}
                    </label>{" "}
                    <div className={"pn-input-group pn-input-group-flat"}>
                      {" "}
                      <WorkspaceInput
                        type={"password"}
                        className={"pn-form-control"}
                        defaultValue={"ultrastrongpassword"}
                        id={"fe2-appended-link"}
                      />{" "}
                      <span className={"pn-input-group-text"}>
                        {" "}
                        <WorkspaceButton
                          type={"button"}
                          className={
                            "pn-link-secondary pn-input-group-link pn-border-0 pn-bg-transparent pn-p-0"
                          }
                          title={"Show password"}
                          aria-label={"Show password"}
                          aria-pressed={"false"}
                          data-password-toggle={"fe2-appended-link"}
                        >
                          {" "}
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
                            className={"pn-icon pn-icon-toggle-show"}
                          >
                            {" "}
                            <path
                              d={"M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"}
                            ></path>{" "}
                            <path
                              d={
                                "M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6"
                              }
                            ></path>{" "}
                          </svg>{" "}
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
                            className={"pn-icon pn-icon-toggle-hide pn-d-none"}
                          >
                            {" "}
                            <path
                              d={"M10.585 10.587a2 2 0 0 0 2.829 2.828"}
                            ></path>{" "}
                            <path
                              d={
                                "M16.681 16.673a8.717 8.717 0 0 1 -4.681 1.327c-3.6 0 -6.6 -2 -9 -6c1.272 -2.12 2.712 -3.678 4.32 -4.674m2.86 -1.146a9.055 9.055 0 0 1 1.82 -.18c3.6 0 6.6 2 9 6c-.666 1.11 -1.379 2.067 -2.138 2.87"
                              }
                            ></path>{" "}
                            <path d={"M3 3l18 18"}></path>{" "}
                          </svg>{" "}
                        </WorkspaceButton>{" "}
                      </span>{" "}
                    </div>{" "}
                  </div>
                </div>
                <div className="form-workbench-example">
                  <div className={"pn-mb-3"}>
                    {" "}
                    <label
                      className={"pn-form-label"}
                      htmlFor={"fe2-appended-kbd"}
                    >
                      {" Input with appended kbd "}
                    </label>{" "}
                    <div className={"pn-input-group pn-input-group-flat"}>
                      {" "}
                      <WorkspaceInput
                        type={"text"}
                        className={"pn-form-control"}
                        id={"fe2-appended-kbd"}
                        autoComplete={"off"}
                      />{" "}
                      <span className={"pn-input-group-text"}>
                        {" "}
                        <kbd>{"ctrl + K"}</kbd>{" "}
                      </span>{" "}
                    </div>{" "}
                  </div>
                </div>
                <div className="form-workbench-example">
                  <div className={"pn-mb-3"}>
                    {" "}
                    <label
                      className={"pn-form-label"}
                      htmlFor={"fe2-appended-icon-links"}
                    >
                      {" Input with appended icon links "}
                    </label>{" "}
                    <div className={"pn-input-group pn-input-group-flat"}>
                      {" "}
                      <WorkspaceInput
                        type={"text"}
                        className={"pn-form-control"}
                        id={"fe2-appended-icon-links"}
                        autoComplete={"off"}
                      />{" "}
                      <span className={"pn-input-group-text"}>
                        {" "}
                        <WorkspaceButton
                          type={"button"}
                          className={
                            "pn-link-secondary pn-border-0 pn-bg-transparent pn-p-0"
                          }
                          title={"Clear search"}
                          aria-label={"Clear search"}
                        >
                          {" "}
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
                            className={"pn-icon"}
                          >
                            {" "}
                            <path d={"M18 6l-12 12"}></path>{" "}
                            <path d={"M6 6l12 12"}></path>{" "}
                          </svg>{" "}
                        </WorkspaceButton>{" "}
                        <WorkspaceButton
                          type={"button"}
                          className={
                            "pn-link-secondary pn-ms-2 pn-border-0 pn-bg-transparent pn-p-0"
                          }
                          title={"Search settings"}
                          aria-label={"Search settings"}
                        >
                          {" "}
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
                            className={"pn-icon"}
                          >
                            {" "}
                            <path
                              d={"M4 10a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"}
                            ></path>{" "}
                            <path d={"M6 4v4"}></path>{" "}
                            <path d={"M6 12v8"}></path>{" "}
                            <path
                              d={"M10 16a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"}
                            ></path>{" "}
                            <path d={"M12 4v10"}></path>{" "}
                            <path d={"M12 18v2"}></path>{" "}
                            <path
                              d={"M16 7a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"}
                            ></path>{" "}
                            <path d={"M18 4v1"}></path>{" "}
                            <path d={"M18 9v11"}></path>{" "}
                          </svg>{" "}
                        </WorkspaceButton>{" "}
                        <WorkspaceButton
                          type={"button"}
                          className={
                            "pn-link-secondary pn-ms-2 pn-border-0 pn-bg-transparent pn-p-0"
                          }
                          title={"Add notification"}
                          aria-label={"Add notification"}
                          disabled
                        >
                          {" "}
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
                            className={"pn-icon"}
                          >
                            {" "}
                            <path
                              d={
                                "M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6"
                              }
                            ></path>{" "}
                            <path d={"M9 17v1a3 3 0 0 0 6 0v-1"}></path>{" "}
                          </svg>{" "}
                        </WorkspaceButton>{" "}
                      </span>{" "}
                    </div>{" "}
                  </div>
                </div>
              </CardContent>
            </WorkspaceForm>
          </section>
          <section
            id="form-category-special"
            className="form-workbench-section"
            hidden={category !== "special"}
            aria-labelledby="form-title-special"
          >
            <div className="form-workbench-section-heading">
              <div>
                <h2 id="form-title-special">Beyond text</h2>
                <p>Dates, masked inputs, uploads, and adjustable values.</p>
              </div>
              <span>8 examples</span>
            </div>
            <WorkspaceForm className="pn-card form-workbench-card">
              <CardContent className="pn-card-body form-workbench-fields">
                <div className="form-workbench-example">
                  <div className={"pn-mb-3"}>
                    {" "}
                    <div className={"pn-form-label"}>{"Datepicker"}</div>{" "}
                    <WorkspaceInput
                      className={"pn-form-control pn-mb-2"}
                      placeholder={"Select a date"}
                      id={"datepicker-default"}
                      defaultValue={"2020-06-20"}
                    />{" "}
                    <div className={"pn-input-icon pn-mb-2"}>
                      {" "}
                      <WorkspaceInput
                        className={"pn-form-control"}
                        placeholder={"Select a date"}
                        id={"datepicker-icon"}
                        defaultValue={"2020-06-20"}
                      />{" "}
                      <span className={"pn-input-icon-addon"}>
                        {" "}
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
                          className={"pn-icon"}
                        >
                          {" "}
                          <path
                            d={
                              "M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12"
                            }
                          ></path>{" "}
                          <path d={"M16 3v4"}></path> <path d={"M8 3v4"}></path>{" "}
                          <path d={"M4 11h16"}></path>{" "}
                          <path d={"M11 15h1"}></path>{" "}
                          <path d={"M12 15v3"}></path>
                        </svg>
                      </span>{" "}
                    </div>{" "}
                    <div className={"pn-input-icon"}>
                      {" "}
                      <span className={"pn-input-icon-addon"}>
                        {" "}
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
                          className={"pn-icon"}
                        >
                          {" "}
                          <path
                            d={
                              "M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12"
                            }
                          ></path>{" "}
                          <path d={"M16 3v4"}></path> <path d={"M8 3v4"}></path>{" "}
                          <path d={"M4 11h16"}></path>{" "}
                          <path d={"M11 15h1"}></path>{" "}
                          <path d={"M12 15v3"}></path>
                        </svg>
                      </span>{" "}
                      <WorkspaceInput
                        className={"pn-form-control"}
                        placeholder={"Select a date"}
                        id={"datepicker-icon-prepend"}
                        defaultValue={"2020-06-20"}
                      />{" "}
                    </div>{" "}
                  </div>
                </div>
                <div className="form-workbench-example">
                  <div className={"pn-mb-3"}>
                    {" "}
                    <div className={"pn-form-label"}>
                      {"Inline datepicker"}
                    </div>{" "}
                    <WorkspaceDatepicker
                      className={"pn-datepicker-inline"}
                      id={"datepicker-inline"}
                    />{" "}
                  </div>
                </div>
                <div className="form-workbench-example">
                  <div className={"pn-mb-3"}>
                    {" "}
                    <div className={"pn-form-label"}>
                      {"Date of birth"}
                    </div>{" "}
                    <div className={"pn-row pn-g-2"}>
                      {" "}
                      <div className={"pn-col-5"}>
                        {" "}
                        <WorkspaceSelect
                          name={"user[month]"}
                          className={"pn-form-select"}
                          defaultValue={"6"}
                        >
                          <option value={""}>{"Month"}</option>
                          <option value={"1"}>{"January"}</option>
                          <option value={"2"}>{"February"}</option>
                          <option value={"3"}>{"March"}</option>
                          <option value={"4"}>{"April"}</option>
                          <option value={"5"}>{"May"}</option>
                          <option value={"6"}>{"June"}</option>
                          <option value={"7"}>{"July"}</option>
                          <option value={"8"}>{"August"}</option>
                          <option value={"9"}>{"September"}</option>
                          <option value={"10"}>{"October"}</option>
                          <option value={"11"}>{"November"}</option>
                          <option value={"12"}>{"December"}</option>
                        </WorkspaceSelect>{" "}
                      </div>{" "}
                      <div className={"pn-col-3"}>
                        {" "}
                        <WorkspaceSelect
                          name={"user[day]"}
                          className={"pn-form-select"}
                          defaultValue={"20"}
                        >
                          <option value={""}>{"Day"}</option>
                          <option value={"1"}>{"1"}</option>
                          <option value={"2"}>{"2"}</option>
                          <option value={"3"}>{"3"}</option>
                          <option value={"4"}>{"4"}</option>
                          <option value={"5"}>{"5"}</option>
                          <option value={"6"}>{"6"}</option>
                          <option value={"7"}>{"7"}</option>
                          <option value={"8"}>{"8"}</option>
                          <option value={"9"}>{"9"}</option>
                          <option value={"10"}>{"10"}</option>
                          <option value={"11"}>{"11"}</option>
                          <option value={"12"}>{"12"}</option>
                          <option value={"13"}>{"13"}</option>
                          <option value={"14"}>{"14"}</option>
                          <option value={"15"}>{"15"}</option>
                          <option value={"16"}>{"16"}</option>
                          <option value={"17"}>{"17"}</option>
                          <option value={"18"}>{"18"}</option>
                          <option value={"19"}>{"19"}</option>
                          <option value={"20"}>{"20"}</option>
                          <option value={"21"}>{"21"}</option>
                          <option value={"22"}>{"22"}</option>
                          <option value={"23"}>{"23"}</option>
                          <option value={"24"}>{"24"}</option>
                          <option value={"25"}>{"25"}</option>
                          <option value={"26"}>{"26"}</option>
                          <option value={"27"}>{"27"}</option>
                          <option value={"28"}>{"28"}</option>
                          <option value={"29"}>{"29"}</option>
                          <option value={"30"}>{"30"}</option>
                          <option value={"31"}>{"31"}</option>
                        </WorkspaceSelect>{" "}
                      </div>{" "}
                      <div className={"pn-col-4"}>
                        {" "}
                        <WorkspaceSelect
                          name={"user[year]"}
                          className={"pn-form-select"}
                          defaultValue={"1989"}
                        >
                          <option value={""}>{"Year"}</option>
                          <option value={"2014"}>{"2014"}</option>
                          <option value={"2013"}>{"2013"}</option>
                          <option value={"2012"}>{"2012"}</option>
                          <option value={"2011"}>{"2011"}</option>
                          <option value={"2010"}>{"2010"}</option>
                          <option value={"2009"}>{"2009"}</option>
                          <option value={"2008"}>{"2008"}</option>
                          <option value={"2007"}>{"2007"}</option>
                          <option value={"2006"}>{"2006"}</option>
                          <option value={"2005"}>{"2005"}</option>
                          <option value={"2004"}>{"2004"}</option>
                          <option value={"2003"}>{"2003"}</option>
                          <option value={"2002"}>{"2002"}</option>
                          <option value={"2001"}>{"2001"}</option>
                          <option value={"2000"}>{"2000"}</option>
                          <option value={"1999"}>{"1999"}</option>
                          <option value={"1998"}>{"1998"}</option>
                          <option value={"1997"}>{"1997"}</option>
                          <option value={"1996"}>{"1996"}</option>
                          <option value={"1995"}>{"1995"}</option>
                          <option value={"1994"}>{"1994"}</option>
                          <option value={"1993"}>{"1993"}</option>
                          <option value={"1992"}>{"1992"}</option>
                          <option value={"1991"}>{"1991"}</option>
                          <option value={"1990"}>{"1990"}</option>
                          <option value={"1989"}>{"1989"}</option>
                          <option value={"1988"}>{"1988"}</option>
                          <option value={"1987"}>{"1987"}</option>
                          <option value={"1986"}>{"1986"}</option>
                          <option value={"1985"}>{"1985"}</option>
                          <option value={"1984"}>{"1984"}</option>
                          <option value={"1983"}>{"1983"}</option>
                          <option value={"1982"}>{"1982"}</option>
                          <option value={"1981"}>{"1981"}</option>
                          <option value={"1980"}>{"1980"}</option>
                          <option value={"1979"}>{"1979"}</option>
                          <option value={"1978"}>{"1978"}</option>
                          <option value={"1977"}>{"1977"}</option>
                          <option value={"1976"}>{"1976"}</option>
                          <option value={"1975"}>{"1975"}</option>
                          <option value={"1974"}>{"1974"}</option>
                          <option value={"1973"}>{"1973"}</option>
                          <option value={"1972"}>{"1972"}</option>
                          <option value={"1971"}>{"1971"}</option>
                          <option value={"1970"}>{"1970"}</option>
                          <option value={"1969"}>{"1969"}</option>
                          <option value={"1968"}>{"1968"}</option>
                          <option value={"1967"}>{"1967"}</option>
                          <option value={"1966"}>{"1966"}</option>
                          <option value={"1965"}>{"1965"}</option>
                          <option value={"1964"}>{"1964"}</option>
                          <option value={"1963"}>{"1963"}</option>
                          <option value={"1962"}>{"1962"}</option>
                          <option value={"1961"}>{"1961"}</option>
                          <option value={"1960"}>{"1960"}</option>
                          <option value={"1959"}>{"1959"}</option>
                          <option value={"1958"}>{"1958"}</option>
                          <option value={"1957"}>{"1957"}</option>
                          <option value={"1956"}>{"1956"}</option>
                          <option value={"1955"}>{"1955"}</option>
                          <option value={"1954"}>{"1954"}</option>
                          <option value={"1953"}>{"1953"}</option>
                          <option value={"1952"}>{"1952"}</option>
                          <option value={"1951"}>{"1951"}</option>
                          <option value={"1950"}>{"1950"}</option>
                          <option value={"1949"}>{"1949"}</option>
                          <option value={"1948"}>{"1948"}</option>
                          <option value={"1947"}>{"1947"}</option>
                          <option value={"1946"}>{"1946"}</option>
                          <option value={"1945"}>{"1945"}</option>
                          <option value={"1944"}>{"1944"}</option>
                          <option value={"1943"}>{"1943"}</option>
                          <option value={"1942"}>{"1942"}</option>
                          <option value={"1941"}>{"1941"}</option>
                          <option value={"1940"}>{"1940"}</option>
                          <option value={"1939"}>{"1939"}</option>
                          <option value={"1938"}>{"1938"}</option>
                          <option value={"1937"}>{"1937"}</option>
                          <option value={"1936"}>{"1936"}</option>
                          <option value={"1935"}>{"1935"}</option>
                          <option value={"1934"}>{"1934"}</option>
                          <option value={"1933"}>{"1933"}</option>
                          <option value={"1932"}>{"1932"}</option>
                          <option value={"1931"}>{"1931"}</option>
                          <option value={"1930"}>{"1930"}</option>
                          <option value={"1929"}>{"1929"}</option>
                          <option value={"1928"}>{"1928"}</option>
                          <option value={"1927"}>{"1927"}</option>
                          <option value={"1926"}>{"1926"}</option>
                          <option value={"1925"}>{"1925"}</option>
                          <option value={"1924"}>{"1924"}</option>
                          <option value={"1923"}>{"1923"}</option>
                          <option value={"1922"}>{"1922"}</option>
                          <option value={"1921"}>{"1921"}</option>
                          <option value={"1920"}>{"1920"}</option>
                          <option value={"1919"}>{"1919"}</option>
                          <option value={"1918"}>{"1918"}</option>
                          <option value={"1917"}>{"1917"}</option>
                          <option value={"1916"}>{"1916"}</option>
                          <option value={"1915"}>{"1915"}</option>
                          <option value={"1914"}>{"1914"}</option>
                          <option value={"1913"}>{"1913"}</option>
                          <option value={"1912"}>{"1912"}</option>
                          <option value={"1911"}>{"1911"}</option>
                          <option value={"1910"}>{"1910"}</option>
                          <option value={"1909"}>{"1909"}</option>
                          <option value={"1908"}>{"1908"}</option>
                          <option value={"1907"}>{"1907"}</option>
                          <option value={"1906"}>{"1906"}</option>
                          <option value={"1905"}>{"1905"}</option>
                          <option value={"1904"}>{"1904"}</option>
                          <option value={"1903"}>{"1903"}</option>
                          <option value={"1902"}>{"1902"}</option>
                          <option value={"1901"}>{"1901"}</option>
                          <option value={"1900"}>{"1900"}</option>
                          <option value={"1899"}>{"1899"}</option>
                          <option value={"1898"}>{"1898"}</option>
                          <option value={"1897"}>{"1897"}</option>
                        </WorkspaceSelect>{" "}
                      </div>{" "}
                    </div>{" "}
                  </div>
                </div>
                <div className="form-workbench-example">
                  <div className={"pn-mb-3"}>
                    {" "}
                    <label
                      className={"pn-form-label"}
                      htmlFor={"fe5-input-mask-date"}
                    >
                      {" Text mask "}
                    </label>{" "}
                    <WorkspaceInput
                      type={"text"}
                      name={"input-mask"}
                      id={"fe5-input-mask-date"}
                      className={"pn-form-control"}
                      data-mask={"00/00/0000"}
                      data-mask-visible={"true"}
                      placeholder={"00/00/0000"}
                      autoComplete={"off"}
                    />{" "}
                  </div>
                </div>
                <div className="form-workbench-example">
                  <div className={"pn-mb-3"}>
                    {" "}
                    <label
                      className={"pn-form-label"}
                      htmlFor={"fe5-input-mask-tel"}
                    >
                      {" Telephone mask "}
                    </label>{" "}
                    <WorkspaceInput
                      type={"text"}
                      name={"input-mask"}
                      id={"fe5-input-mask-tel"}
                      className={"pn-form-control"}
                      data-mask={"(00) 0000-0000"}
                      data-mask-visible={"true"}
                      placeholder={"(00) 0000-0000"}
                      autoComplete={"off"}
                    />{" "}
                  </div>
                </div>
                <div className="form-workbench-example">
                  <div className={"pn-mb-3"}>
                    {" "}
                    <div className={"pn-form-label"}>
                      {"Custom File Input"}
                    </div>{" "}
                    <WorkspaceInput
                      type={"file"}
                      className={"pn-form-control"}
                    />{" "}
                  </div>
                </div>
                <div className="form-workbench-example">
                  <div className={"pn-mb-3"}>
                    {" "}
                    <div className={"pn-form-label"}>{"Range input"}</div>{" "}
                    <WorkspaceInput
                      type={"range"}
                      className={"pn-form-range pn-mb-2"}
                      defaultValue={"40"}
                      min={"0"}
                      max={"100"}
                      step={"10"}
                    />{" "}
                    <WorkspaceRange
                      className={"pn-form-range pn-mb-2"}
                      id={"range-simple"}
                    />{" "}
                    <WorkspaceRange
                      className={"pn-form-range pn-mb-2"}
                      id={"range-connect"}
                    />{" "}
                    <WorkspaceRange
                      className={"pn-form-range pn-mb-2 pn-text-green"}
                      id={"range-color"}
                    />{" "}
                  </div>
                </div>
                <div className="form-workbench-example">
                  <div className={"pn-mb-3"}>
                    {" "}
                    <div className={"pn-form-label"}>{"Progress"}</div>{" "}
                    <div className={"pn-progress pn-mb-2"}>
                      {" "}
                      <div
                        className={"pn-progress-bar"}
                        style={{ width: "38%" } as CSSProperties}
                        role={"progressbar"}
                        aria-valuenow={38}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={"38% Complete"}
                      >
                        {" "}
                        <span className={"pn-visually-hidden"}>
                          {"38% Complete"}
                        </span>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-progress"}>
                      {" "}
                      <div
                        className={
                          "pn-progress-bar pn-progress-bar-indeterminate pn-bg-green"
                        }
                      ></div>{" "}
                    </div>{" "}
                  </div>
                </div>
              </CardContent>
            </WorkspaceForm>
          </section>
          <section
            id="form-category-feedback"
            className="form-workbench-section"
            hidden={category !== "feedback"}
            aria-labelledby="form-title-feedback"
          >
            <div className="form-workbench-section-heading">
              <div>
                <h2 id="form-title-feedback">Guide the next step</h2>
                <p>
                  Validation, grouped fields, and actions at the end of a form.
                </p>
              </div>
              <span>8 examples</span>
            </div>
            <WorkspaceForm className="pn-card form-workbench-card">
              <CardContent className="pn-card-body form-workbench-fields">
                <div className="form-workbench-example">
                  <div className={"pn-mb-3"}>
                    {" "}
                    <div className={"pn-form-label"}>
                      {"Validation States"}
                    </div>{" "}
                    <WorkspaceInput
                      type={"text"}
                      className={"pn-form-control pn-is-valid pn-mb-2"}
                      placeholder={"Valid State.."}
                      aria-invalid={"false"}
                    />{" "}
                    <WorkspaceInput
                      type={"text"}
                      className={"pn-form-control pn-is-invalid"}
                      placeholder={"Invalid State.."}
                      aria-invalid={"true"}
                      aria-describedby={"validation-invalid-feedback"}
                    />{" "}
                    <div
                      className={"pn-invalid-feedback"}
                      id={"validation-invalid-feedback"}
                    >
                      {"Invalid feedback"}
                    </div>{" "}
                  </div>
                </div>
                <div className="form-workbench-example">
                  <div className={"pn-mb-3"}>
                    {" "}
                    <div className={"pn-form-label"}>
                      {"Validation States (lite)"}
                    </div>{" "}
                    <WorkspaceInput
                      type={"text"}
                      className={
                        "pn-form-control pn-is-valid pn-is-valid-lite pn-mb-2"
                      }
                      placeholder={"Valid State.."}
                      aria-invalid={"false"}
                    />{" "}
                    <WorkspaceInput
                      type={"text"}
                      className={
                        "pn-form-control pn-is-invalid pn-is-invalid-lite"
                      }
                      placeholder={"Invalid State.."}
                      aria-invalid={"true"}
                    />{" "}
                  </div>
                </div>
                <div className="form-workbench-example is-fieldset">
                  <label className={"pn-form-label"}>{"Form fieldset"}</label>
                  <fieldset className={"pn-form-fieldset"}>
                    {" "}
                    <div className={"pn-mb-3"}>
                      {" "}
                      <label
                        className={"pn-form-label pn-required"}
                        htmlFor={"fe3-fieldset-name"}
                      >
                        {" Full name "}
                        <span className={"pn-visually-hidden"}>
                          {" (required)"}
                        </span>{" "}
                      </label>{" "}
                      <WorkspaceInput
                        type={"text"}
                        id={"fe3-fieldset-name"}
                        className={"pn-form-control"}
                        autoComplete={"name"}
                        aria-required={"true"}
                      />{" "}
                    </div>{" "}
                    <div className={"pn-mb-3"}>
                      {" "}
                      <label
                        className={"pn-form-label pn-required"}
                        htmlFor={"fe3-fieldset-company"}
                      >
                        {" Company "}
                        <span className={"pn-visually-hidden"}>
                          {" (required)"}
                        </span>{" "}
                      </label>{" "}
                      <WorkspaceInput
                        type={"text"}
                        id={"fe3-fieldset-company"}
                        className={"pn-form-control"}
                        autoComplete={"organization"}
                        aria-required={"true"}
                      />{" "}
                    </div>{" "}
                    <div className={"pn-mb-3"}>
                      {" "}
                      <label
                        className={"pn-form-label pn-required"}
                        htmlFor={"fe3-fieldset-email"}
                      >
                        {" Email "}
                        <span className={"pn-visually-hidden"}>
                          {" (required)"}
                        </span>{" "}
                      </label>{" "}
                      <WorkspaceInput
                        type={"email"}
                        id={"fe3-fieldset-email"}
                        className={"pn-form-control"}
                        autoComplete={"email"}
                        aria-required={"true"}
                      />{" "}
                    </div>{" "}
                    <div className={"pn-mb-3"}>
                      {" "}
                      <label
                        className={"pn-form-label"}
                        htmlFor={"fe3-fieldset-phone"}
                      >
                        {" Phone number "}
                      </label>{" "}
                      <WorkspaceInput
                        type={"tel"}
                        id={"fe3-fieldset-phone"}
                        className={"pn-form-control"}
                        autoComplete={"tel"}
                      />{" "}
                    </div>{" "}
                    <label className={"pn-form-check"}>
                      {" "}
                      <WorkspaceInput
                        type={"checkbox"}
                        className={"pn-form-check-input"}
                      />{" "}
                      <span className={"pn-form-check-label pn-required"}>
                        {"I agree to the Terms & Conditions"}
                      </span>{" "}
                    </label>{" "}
                  </fieldset>
                </div>
                <div className="form-workbench-example">
                  <div className={"pn-mb-3"}>
                    {" "}
                    <div className={"pn-form-label"}>
                      {"Buttons group"}
                    </div>{" "}
                    <fieldset>
                      {" "}
                      <legend className={"pn-visually-hidden"}>
                        {"Buttons group"}
                      </legend>{" "}
                      <div className={"pn-btn-group pn-w-100"} role={"group"}>
                        {" "}
                        <WorkspaceInput
                          type={"radio"}
                          className={"pn-btn-check"}
                          name={"btn-radio-basic"}
                          id={"btn-radio-basic-1"}
                          autoComplete={"off"}
                          defaultChecked
                        />{" "}
                        <label
                          htmlFor={"btn-radio-basic-1"}
                          className={"pn-btn"}
                        >
                          {"1 min"}
                        </label>{" "}
                        <WorkspaceInput
                          type={"radio"}
                          className={"pn-btn-check"}
                          name={"btn-radio-basic"}
                          id={"btn-radio-basic-2"}
                          autoComplete={"off"}
                        />{" "}
                        <label
                          htmlFor={"btn-radio-basic-2"}
                          className={"pn-btn"}
                        >
                          {"5 min"}
                        </label>{" "}
                        <WorkspaceInput
                          type={"radio"}
                          className={"pn-btn-check"}
                          name={"btn-radio-basic"}
                          id={"btn-radio-basic-3"}
                          autoComplete={"off"}
                        />{" "}
                        <label
                          htmlFor={"btn-radio-basic-3"}
                          className={"pn-btn"}
                        >
                          {"10 min"}
                        </label>{" "}
                        <WorkspaceInput
                          type={"radio"}
                          className={"pn-btn-check"}
                          name={"btn-radio-basic"}
                          id={"btn-radio-basic-4"}
                          autoComplete={"off"}
                        />{" "}
                        <label
                          htmlFor={"btn-radio-basic-4"}
                          className={"pn-btn"}
                        >
                          {"30 min"}
                        </label>{" "}
                      </div>{" "}
                    </fieldset>{" "}
                  </div>
                </div>
                <div className="form-workbench-example">
                  <div className={"pn-mb-3"}>
                    {" "}
                    <div className={"pn-form-label"}>
                      {"Buttons group with dropdown"}
                    </div>{" "}
                    <fieldset>
                      {" "}
                      <legend className={"pn-visually-hidden"}>
                        {"Buttons group with dropdown"}
                      </legend>{" "}
                      <div className={"pn-btn-group pn-w-100"} role={"group"}>
                        {" "}
                        <WorkspaceInput
                          type={"radio"}
                          className={"pn-btn-check"}
                          name={"btn-radio-dropdown"}
                          id={"btn-radio-dropdown-1"}
                          autoComplete={"off"}
                          defaultChecked
                        />{" "}
                        <label
                          htmlFor={"btn-radio-dropdown-1"}
                          className={"pn-btn"}
                        >
                          {"Option 1"}
                        </label>{" "}
                        <WorkspaceInput
                          type={"radio"}
                          className={"pn-btn-check"}
                          name={"btn-radio-dropdown"}
                          id={"btn-radio-dropdown-2"}
                          autoComplete={"off"}
                        />{" "}
                        <label
                          htmlFor={"btn-radio-dropdown-2"}
                          className={"pn-btn"}
                        >
                          {"Option 2"}
                        </label>{" "}
                        <WorkspaceDropdown
                          className={"pn-btn-group"}
                          role={"group"}
                        >
                          {" "}
                          <WorkspaceInput
                            type={"radio"}
                            className={"pn-btn-check"}
                            name={"btn-radio-dropdown"}
                            id={"btn-radio-dropdown-dropdown"}
                            autoComplete={"off"}
                          />{" "}
                          <WorkspaceDropdownTrigger
                            htmlFor={"btn-radio-dropdown-dropdown"}
                            className={"pn-btn pn-dropdown-toggle"}
                            aria-haspopup={"true"}
                          >
                            {" Other "}
                          </WorkspaceDropdownTrigger>{" "}
                          <WorkspaceDropdownContent
                            className={"pn-dropdown-menu"}
                          >
                            {" "}
                            <WorkspaceDropdownItem
                              className={"pn-dropdown-item"}
                              href={"#"}
                            >
                              {" Action "}
                            </WorkspaceDropdownItem>{" "}
                            <WorkspaceDropdownItem
                              className={"pn-dropdown-item"}
                              href={"#"}
                            >
                              {" Another action "}
                            </WorkspaceDropdownItem>{" "}
                          </WorkspaceDropdownContent>{" "}
                          <WorkspaceDropdownContent
                            className={"pn-dropdown-menu pn-dropdown-menu-end"}
                          >
                            {" "}
                            <WorkspaceDropdownItem
                              className={"pn-dropdown-item"}
                              href={"#"}
                            >
                              {" Option 4 "}
                            </WorkspaceDropdownItem>{" "}
                            <WorkspaceDropdownItem
                              className={"pn-dropdown-item"}
                              href={"#"}
                            >
                              {" Option 5 "}
                            </WorkspaceDropdownItem>{" "}
                            <WorkspaceDropdownItem
                              className={"pn-dropdown-item"}
                              href={"#"}
                            >
                              {" Option 6 "}
                            </WorkspaceDropdownItem>{" "}
                          </WorkspaceDropdownContent>{" "}
                        </WorkspaceDropdown>{" "}
                      </div>{" "}
                    </fieldset>{" "}
                  </div>
                </div>
                <div className="form-workbench-example">
                  <div className={"pn-row"}>
                    {" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-mb-3"}>
                        {" "}
                        <div className={"pn-form-label"}>
                          {"Vertical buttons group"}
                        </div>{" "}
                        <fieldset>
                          {" "}
                          <legend className={"pn-visually-hidden"}>
                            {"Vertical buttons group"}
                          </legend>{" "}
                          <div
                            className={"pn-btn-group-vertical pn-w-100"}
                            role={"group"}
                          >
                            {" "}
                            <WorkspaceInput
                              type={"radio"}
                              className={"pn-btn-check"}
                              name={"btn-radio-vertical"}
                              id={"btn-radio-vertical-1"}
                              autoComplete={"off"}
                              defaultChecked
                            />{" "}
                            <label
                              htmlFor={"btn-radio-vertical-1"}
                              className={"pn-btn"}
                            >
                              {"Button 1"}
                            </label>{" "}
                            <WorkspaceInput
                              type={"radio"}
                              className={"pn-btn-check"}
                              name={"btn-radio-vertical"}
                              id={"btn-radio-vertical-2"}
                              autoComplete={"off"}
                            />{" "}
                            <label
                              htmlFor={"btn-radio-vertical-2"}
                              className={"pn-btn"}
                            >
                              {"Button 2"}
                            </label>{" "}
                            <WorkspaceInput
                              type={"radio"}
                              className={"pn-btn-check"}
                              name={"btn-radio-vertical"}
                              id={"btn-radio-vertical-3"}
                              autoComplete={"off"}
                            />{" "}
                            <label
                              htmlFor={"btn-radio-vertical-3"}
                              className={"pn-btn"}
                            >
                              {"Button 3"}
                            </label>{" "}
                            <WorkspaceInput
                              type={"radio"}
                              className={"pn-btn-check"}
                              name={"btn-radio-vertical"}
                              id={"btn-radio-vertical-4"}
                              autoComplete={"off"}
                            />{" "}
                            <label
                              htmlFor={"btn-radio-vertical-4"}
                              className={"pn-btn"}
                            >
                              {"Button 4"}
                            </label>{" "}
                            <WorkspaceInput
                              type={"radio"}
                              className={"pn-btn-check"}
                              name={"btn-radio-vertical"}
                              id={"btn-radio-vertical-5"}
                              autoComplete={"off"}
                            />{" "}
                            <label
                              htmlFor={"btn-radio-vertical-5"}
                              className={"pn-btn"}
                            >
                              {"Button 5"}
                            </label>{" "}
                          </div>{" "}
                        </fieldset>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-col"}>
                      {" "}
                      <div className={"pn-mb-3"}>
                        {" "}
                        <div className={"pn-form-label"}>
                          {"Vertical with dropdown"}
                        </div>{" "}
                        <fieldset>
                          {" "}
                          <legend className={"pn-visually-hidden"}>
                            {"Vertical with dropdown"}
                          </legend>{" "}
                          <div
                            className={"pn-btn-group-vertical pn-w-100"}
                            role={"group"}
                          >
                            {" "}
                            <WorkspaceInput
                              type={"radio"}
                              className={"pn-btn-check"}
                              name={"btn-radio-vertical-dropdown"}
                              id={"btn-radio-vertical-dropdown-1"}
                              autoComplete={"off"}
                              defaultChecked
                            />{" "}
                            <label
                              htmlFor={"btn-radio-vertical-dropdown-1"}
                              className={"pn-btn"}
                            >
                              {"Button 1"}
                            </label>{" "}
                            <WorkspaceInput
                              type={"radio"}
                              className={"pn-btn-check"}
                              name={"btn-radio-vertical-dropdown"}
                              id={"btn-radio-vertical-dropdown-2"}
                              autoComplete={"off"}
                            />{" "}
                            <label
                              htmlFor={"btn-radio-vertical-dropdown-2"}
                              className={"pn-btn"}
                            >
                              {"Button 2"}
                            </label>{" "}
                            <WorkspaceInput
                              type={"radio"}
                              className={"pn-btn-check"}
                              name={"btn-radio-vertical-dropdown"}
                              id={"btn-radio-vertical-dropdown-3"}
                              autoComplete={"off"}
                            />{" "}
                            <label
                              htmlFor={"btn-radio-vertical-dropdown-3"}
                              className={"pn-btn"}
                            >
                              {"Button 3"}
                            </label>{" "}
                            <WorkspaceInput
                              type={"radio"}
                              className={"pn-btn-check"}
                              name={"btn-radio-vertical-dropdown"}
                              id={"btn-radio-vertical-dropdown-4"}
                              autoComplete={"off"}
                            />{" "}
                            <label
                              htmlFor={"btn-radio-vertical-dropdown-4"}
                              className={"pn-btn"}
                            >
                              {"Button 4"}
                            </label>{" "}
                            <WorkspaceDropdown
                              className={"pn-btn-group"}
                              role={"group"}
                            >
                              {" "}
                              <WorkspaceInput
                                type={"radio"}
                                className={"pn-btn-check"}
                                name={"btn-radio-vertical-dropdown"}
                                id={"btn-radio-vertical-dropdown-dropdown"}
                                autoComplete={"off"}
                              />{" "}
                              <WorkspaceDropdownTrigger
                                htmlFor={"btn-radio-vertical-dropdown-dropdown"}
                                className={"pn-btn pn-dropdown-toggle"}
                                aria-haspopup={"true"}
                              >
                                {" Other "}
                              </WorkspaceDropdownTrigger>{" "}
                              <WorkspaceDropdownContent
                                className={"pn-dropdown-menu"}
                              >
                                {" "}
                                <WorkspaceDropdownItem
                                  className={"pn-dropdown-item"}
                                  href={"#"}
                                >
                                  {" Action "}
                                </WorkspaceDropdownItem>{" "}
                                <WorkspaceDropdownItem
                                  className={"pn-dropdown-item"}
                                  href={"#"}
                                >
                                  {" Another action "}
                                </WorkspaceDropdownItem>{" "}
                              </WorkspaceDropdownContent>{" "}
                              <WorkspaceDropdownContent
                                className={
                                  "pn-dropdown-menu pn-dropdown-menu-end"
                                }
                              >
                                {" "}
                                <WorkspaceDropdownItem
                                  className={"pn-dropdown-item"}
                                  href={"#"}
                                >
                                  {" Option 4 "}
                                </WorkspaceDropdownItem>{" "}
                                <WorkspaceDropdownItem
                                  className={"pn-dropdown-item"}
                                  href={"#"}
                                >
                                  {" Option 5 "}
                                </WorkspaceDropdownItem>{" "}
                                <WorkspaceDropdownItem
                                  className={"pn-dropdown-item"}
                                  href={"#"}
                                >
                                  {" Option 6 "}
                                </WorkspaceDropdownItem>{" "}
                              </WorkspaceDropdownContent>{" "}
                            </WorkspaceDropdown>{" "}
                          </div>{" "}
                        </fieldset>{" "}
                      </div>{" "}
                    </div>{" "}
                  </div>
                </div>
                <div className="form-workbench-example">
                  <div className={"pn-mb-3"}>
                    {" "}
                    <div className={"pn-form-label"}>{"Toolbar"}</div>{" "}
                    <fieldset>
                      {" "}
                      <legend className={"pn-visually-hidden"}>
                        {"Toolbar"}
                      </legend>{" "}
                      <div className={"pn-btn-group pn-w-100"} role={"group"}>
                        {" "}
                        <WorkspaceInput
                          type={"radio"}
                          className={"pn-btn-check"}
                          name={"btn-radio-toolbar"}
                          id={"btn-radio-toolbar-1"}
                          autoComplete={"off"}
                          defaultChecked
                        />{" "}
                        <label
                          htmlFor={"btn-radio-toolbar-1"}
                          className={"pn-btn pn-btn-icon"}
                        >
                          {" "}
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
                            className={"pn-icon"}
                          >
                            {" "}
                            <path
                              d={"M7 5h6a3.5 3.5 0 0 1 0 7h-6l0 -7"}
                            ></path>{" "}
                            <path d={"M13 12h1a3.5 3.5 0 0 1 0 7h-7v-7"}></path>
                          </svg>
                        </label>{" "}
                        <WorkspaceInput
                          type={"radio"}
                          className={"pn-btn-check"}
                          name={"btn-radio-toolbar"}
                          id={"btn-radio-toolbar-2"}
                          autoComplete={"off"}
                        />{" "}
                        <label
                          htmlFor={"btn-radio-toolbar-2"}
                          className={"pn-btn pn-btn-icon"}
                        >
                          {" "}
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
                            className={"pn-icon"}
                          >
                            {" "}
                            <path d={"M11 5l6 0"}></path>{" "}
                            <path d={"M7 19l6 0"}></path>{" "}
                            <path d={"M14 5l-4 14"}></path>
                          </svg>
                        </label>{" "}
                        <WorkspaceInput
                          type={"radio"}
                          className={"pn-btn-check"}
                          name={"btn-radio-toolbar"}
                          id={"btn-radio-toolbar-3"}
                          autoComplete={"off"}
                        />{" "}
                        <label
                          htmlFor={"btn-radio-toolbar-3"}
                          className={"pn-btn pn-btn-icon"}
                        >
                          {" "}
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
                            className={"pn-icon"}
                          >
                            {" "}
                            <path d={"M7 5v5a5 5 0 0 0 10 0v-5"}></path>{" "}
                            <path d={"M5 19h14"}></path>
                          </svg>
                        </label>{" "}
                        <WorkspaceInput
                          type={"radio"}
                          className={"pn-btn-check"}
                          name={"btn-radio-toolbar"}
                          id={"btn-radio-toolbar-4"}
                          autoComplete={"off"}
                        />{" "}
                        <label
                          htmlFor={"btn-radio-toolbar-4"}
                          className={"pn-btn pn-btn-icon"}
                        >
                          {" "}
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
                            className={"pn-icon"}
                          >
                            {" "}
                            <path
                              d={
                                "M7 9.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667l0 -8.666"
                              }
                            ></path>{" "}
                            <path
                              d={
                                "M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1"
                              }
                            ></path>
                          </svg>
                        </label>{" "}
                        <WorkspaceInput
                          type={"radio"}
                          className={"pn-btn-check"}
                          name={"btn-radio-toolbar"}
                          id={"btn-radio-toolbar-5"}
                          autoComplete={"off"}
                        />{" "}
                        <label
                          htmlFor={"btn-radio-toolbar-5"}
                          className={"pn-btn pn-btn-icon"}
                        >
                          {" "}
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
                            className={"pn-icon"}
                          >
                            {" "}
                            <path
                              d={"M3 7a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"}
                            ></path>{" "}
                            <path
                              d={"M3 17a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"}
                            ></path>{" "}
                            <path d={"M8.6 8.6l10.4 10.4"}></path>{" "}
                            <path d={"M8.6 15.4l10.4 -10.4"}></path>
                          </svg>
                        </label>{" "}
                        <WorkspaceInput
                          type={"radio"}
                          className={"pn-btn-check"}
                          name={"btn-radio-toolbar"}
                          id={"btn-radio-toolbar-6"}
                          autoComplete={"off"}
                        />{" "}
                        <label
                          htmlFor={"btn-radio-toolbar-6"}
                          className={"pn-btn pn-btn-icon"}
                        >
                          {" "}
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
                            className={"pn-icon"}
                          >
                            {" "}
                            <path d={"M14 3v4a1 1 0 0 0 1 1h4"}></path>{" "}
                            <path
                              d={
                                "M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2"
                              }
                            ></path>{" "}
                            <path d={"M12 11l0 6"}></path>{" "}
                            <path d={"M9 14l6 0"}></path>
                          </svg>
                        </label>{" "}
                        <WorkspaceInput
                          type={"radio"}
                          className={"pn-btn-check"}
                          name={"btn-radio-toolbar"}
                          id={"btn-radio-toolbar-7"}
                          autoComplete={"off"}
                        />{" "}
                        <label
                          htmlFor={"btn-radio-toolbar-7"}
                          className={"pn-btn pn-btn-icon"}
                        >
                          {" "}
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
                            className={"pn-icon"}
                          >
                            {" "}
                            <path d={"M14 3v4a1 1 0 0 0 1 1h4"}></path>{" "}
                            <path
                              d={
                                "M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2"
                              }
                            ></path>{" "}
                            <path d={"M9 14l6 0"}></path>
                          </svg>
                        </label>{" "}
                      </div>{" "}
                    </fieldset>{" "}
                  </div>
                </div>
                <div className="form-workbench-example">
                  <div className={"pn-mb-3"}>
                    {" "}
                    <div className={"pn-form-label"}>{"Form buttons"}</div>{" "}
                    <div className={"pn-row"}>
                      {" "}
                      <div className={"pn-col"}>
                        {" "}
                        <WorkspaceButton
                          type={"button"}
                          className={"pn-btn pn-w-100"}
                        >
                          {" "}
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
                            className={"pn-icon"}
                          >
                            {" "}
                            <path
                              d={
                                "M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5"
                              }
                            ></path>
                          </svg>
                          {"Login with Github "}
                        </WorkspaceButton>{" "}
                      </div>{" "}
                      <div className={"pn-col"}>
                        {" "}
                        <WorkspaceButton
                          type={"button"}
                          className={"pn-btn pn-w-100"}
                        >
                          {" "}
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
                            className={"pn-icon"}
                          >
                            {" "}
                            <path
                              d={"M4 4l11.733 16h4.267l-11.733 -16l-4.267 0"}
                            ></path>{" "}
                            <path
                              d={"M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"}
                            ></path>
                          </svg>
                          {"Login with X "}
                        </WorkspaceButton>{" "}
                      </div>{" "}
                    </div>{" "}
                  </div>
                </div>
              </CardContent>
            </WorkspaceForm>
          </section>
          <section
            id="form-category-compositions"
            hidden={category !== "compositions"}
            aria-labelledby="form-title-compositions"
          >
            <div className="form-workbench-section-heading">
              <div>
                <h2 id="form-title-compositions">Put it together</h2>
                <p>
                  Finished patterns for profiles, workspace settings, and
                  requests.
                </p>
              </div>
              <span>7 examples</span>
            </div>
            <div className="form-workbench-compositions">
              <div className="form-workbench-composition">
                <Card className={"pn-card pn-h-100"}>
                  {" "}
                  <CardContent className={"pn-card-body"}>
                    {" "}
                    <CardTitle className={"pn-card-title"}>
                      {"Project ID"}
                    </CardTitle>{" "}
                    <CardDescription className={"pn-card-subtitle"}>
                      {"Used when interacting with the API."}
                    </CardDescription>{" "}
                    <div className={"pn-input-icon"}>
                      {" "}
                      <WorkspaceInput
                        type={"text"}
                        defaultValue={"prj_5ae74426fe935327a8fa178b07d84ad9"}
                        className={"pn-form-control"}
                        placeholder={"Search…"}
                        readOnly
                      />{" "}
                      <span className={"pn-input-icon-addon"}>
                        {" "}
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
                          className={"pn-icon"}
                        >
                          {" "}
                          <path d={"M15 3v4a1 1 0 0 0 1 1h4"}></path>{" "}
                          <path
                            d={
                              "M18 17h-7a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h4l5 5v7a2 2 0 0 1 -2 2"
                            }
                          ></path>{" "}
                          <path
                            d={
                              "M16 17v2a2 2 0 0 1 -2 2h-7a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h2"
                            }
                          ></path>
                        </svg>
                      </span>{" "}
                    </div>{" "}
                  </CardContent>{" "}
                  <CardFooter className={"pn-card-footer"}>
                    {" "}
                    <div className={"pn-row pn-align-items-center"}>
                      {" "}
                      <div className={"pn-col"}>
                        {"Learn more about "}
                        <WorkspaceLink href={"#"}>{"Project ID"}</WorkspaceLink>
                      </div>{" "}
                      <div className={"pn-col-auto"}>
                        <WorkspaceButton
                          type={"button"}
                          className={"pn-btn pn-btn-primary"}
                        >
                          {"Save"}
                        </WorkspaceButton>
                      </div>{" "}
                    </div>{" "}
                  </CardFooter>{" "}
                </Card>
              </div>
              <div className="form-workbench-composition">
                <Card className={"pn-card"}>
                  {" "}
                  <CardContent className={"pn-card-body"}>
                    {" "}
                    <CardTitle className={"pn-card-title"}>
                      {"Node.js Version"}
                    </CardTitle>{" "}
                    <CardDescription className={"pn-card-subtitle"}>
                      {
                        "The version of Node.js that is used in the Build Step and for Serverless Functions. A new Deployment is required for your changes to take effect."
                      }
                    </CardDescription>{" "}
                    <WorkspaceSelect className={"pn-form-select"}>
                      <option>{"14.x"}</option>
                      <option>{"12.x"}</option>
                    </WorkspaceSelect>{" "}
                  </CardContent>{" "}
                  <CardFooter className={"pn-card-footer"}>
                    {"Learn more about "}
                    <WorkspaceLink href={"#"}>
                      {"Node.js Version"}
                    </WorkspaceLink>
                  </CardFooter>{" "}
                </Card>
              </div>
              <div className="form-workbench-composition">
                <WorkspaceForm className={"pn-card pn-h-100"}>
                  {" "}
                  <CardHeader className={"pn-card-header"}>
                    {" "}
                    <CardTitle className={"pn-card-title"}>
                      {"Basic form"}
                    </CardTitle>{" "}
                  </CardHeader>{" "}
                  <CardContent className={"pn-card-body"}>
                    {" "}
                    <div className={"pn-mb-3"}>
                      {" "}
                      <label
                        className={"pn-form-label pn-required"}
                        htmlFor={"form-layout-email"}
                      >
                        {"Email address"}
                      </label>{" "}
                      <div>
                        {" "}
                        <WorkspaceInput
                          type={"email"}
                          id={"form-layout-email"}
                          className={"pn-form-control"}
                          aria-describedby={"form-layout-email-hint"}
                          aria-required={"true"}
                          placeholder={"Enter email"}
                          autoComplete={"email"}
                        />{" "}
                        <small
                          id={"form-layout-email-hint"}
                          className={"pn-form-hint"}
                        >
                          {
                            " Use the address where you receive project updates. "
                          }
                        </small>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-mb-3"}>
                      {" "}
                      <label
                        className={"pn-form-label pn-required"}
                        htmlFor={"form-layout-password"}
                      >
                        {"Password"}
                      </label>{" "}
                      <div>
                        {" "}
                        <WorkspaceInput
                          type={"password"}
                          id={"form-layout-password"}
                          className={"pn-form-control"}
                          aria-describedby={"form-layout-password-hint"}
                          aria-required={"true"}
                          placeholder={"Password"}
                        />{" "}
                        <small
                          id={"form-layout-password-hint"}
                          className={"pn-form-hint"}
                        >
                          {
                            " Use at least eight characters. This demo does not store passwords. "
                          }
                        </small>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-mb-3"}>
                      {" "}
                      <label
                        className={"pn-form-label"}
                        htmlFor={"form-layout-select"}
                      >
                        {"Select"}
                      </label>{" "}
                      <div>
                        {" "}
                        <WorkspaceSelect
                          className={"pn-form-select"}
                          id={"form-layout-select"}
                        >
                          <option>{"Option 1"}</option>
                          <optgroup label={"Optgroup 1"}>
                            <option>{"Option 1"}</option>
                            <option>{"Option 2"}</option>
                          </optgroup>
                          <option>{"Option 2"}</option>
                          <optgroup label={"Optgroup 2"}>
                            <option>{"Option 1"}</option>
                            <option>{"Option 2"}</option>
                          </optgroup>
                          <optgroup label={"Optgroup 3"}>
                            <option>{"Option 1"}</option>
                            <option>{"Option 2"}</option>
                          </optgroup>
                          <option>{"Option 3"}</option>
                          <option>{"Option 4"}</option>
                        </WorkspaceSelect>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-mb-3"}>
                      {" "}
                      <label className={"pn-form-label"}>
                        {"Checkboxes"}
                      </label>{" "}
                      <fieldset>
                        {" "}
                        <legend className={"pn-visually-hidden"}>
                          {"Checkboxes"}
                        </legend>{" "}
                        <label className={"pn-form-check"}>
                          {" "}
                          <WorkspaceInput
                            className={"pn-form-check-input"}
                            type={"checkbox"}
                            defaultChecked
                          />{" "}
                          <span className={"pn-form-check-label"}>
                            {"Option 1"}
                          </span>{" "}
                        </label>{" "}
                        <label className={"pn-form-check"}>
                          {" "}
                          <WorkspaceInput
                            className={"pn-form-check-input"}
                            type={"checkbox"}
                          />{" "}
                          <span className={"pn-form-check-label"}>
                            {"Option 2"}
                          </span>{" "}
                        </label>{" "}
                        <label className={"pn-form-check"}>
                          {" "}
                          <WorkspaceInput
                            className={"pn-form-check-input"}
                            type={"checkbox"}
                            disabled
                          />{" "}
                          <span className={"pn-form-check-label"}>
                            {"Option 3"}
                          </span>{" "}
                        </label>{" "}
                      </fieldset>{" "}
                    </div>{" "}
                  </CardContent>{" "}
                  <CardFooter className={"pn-card-footer"}>
                    {" "}
                    <div className={"pn-text-end"}>
                      {" "}
                      <WorkspaceButton
                        type={"submit"}
                        className={"pn-btn pn-btn-primary"}
                      >
                        {"Submit"}
                      </WorkspaceButton>{" "}
                    </div>{" "}
                  </CardFooter>{" "}
                </WorkspaceForm>
              </div>
              <div className="form-workbench-composition">
                <WorkspaceForm className={"pn-card pn-h-100"}>
                  {" "}
                  <CardHeader className={"pn-card-header"}>
                    {" "}
                    <CardTitle className={"pn-card-title"}>
                      {"My Profile"}
                    </CardTitle>{" "}
                  </CardHeader>{" "}
                  <CardContent className={"pn-card-body"}>
                    {" "}
                    <div className={"pn-mb-3"}>
                      {" "}
                      <div className={"pn-row"}>
                        {" "}
                        <div className={"pn-col-auto"}>
                          <span
                            style={
                              {
                                backgroundImage:
                                  "url(/assets/overtrue/people/june.svg)",
                              } as CSSProperties
                            }
                            className={"pn-avatar pn-avatar-md"}
                          ></span>
                        </div>{" "}
                        <div className={"pn-col"}>
                          {" "}
                          <div className={"pn-mb-3"}>
                            {" "}
                            <label className={"pn-d-block"}>
                              {" "}
                              <span className={"pn-form-label"}>
                                {" Email-Address "}
                              </span>{" "}
                              <WorkspaceInput
                                className={"pn-form-control"}
                                placeholder={"your-email@domain.com"}
                              />{" "}
                            </label>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-mb-3"}>
                      {" "}
                      <label className={"pn-d-block"}>
                        {" "}
                        <span className={"pn-form-label"}>{" Bio "}</span>{" "}
                        <WorkspaceTextarea
                          className={"pn-form-control"}
                          rows={5}
                          defaultValue={
                            "Big belly rude boy, million dollar hustler. Unemployed."
                          }
                        />{" "}
                      </label>{" "}
                    </div>{" "}
                    <div className={"pn-mb-3"}>
                      {" "}
                      <label className={"pn-d-block"}>
                        {" "}
                        <span className={"pn-form-label"}>
                          {" Email-Address "}
                        </span>{" "}
                        <WorkspaceInput
                          className={"pn-form-control"}
                          placeholder={"your-email@domain.com"}
                        />{" "}
                      </label>{" "}
                    </div>{" "}
                    <div className={"pn-mb-3"}>
                      {" "}
                      <label className={"pn-d-block"}>
                        {" "}
                        <span className={"pn-form-label"}>
                          {" Password "}
                        </span>{" "}
                        <WorkspaceInput
                          type={"password"}
                          className={"pn-form-control"}
                          defaultValue={"password"}
                        />{" "}
                      </label>{" "}
                    </div>{" "}
                  </CardContent>{" "}
                  <CardFooter className={"pn-card-footer pn-text-end"}>
                    {" "}
                    <WorkspaceButton
                      type={"button"}
                      className={"pn-btn pn-btn-primary"}
                    >
                      {"Save"}
                    </WorkspaceButton>{" "}
                  </CardFooter>{" "}
                </WorkspaceForm>
              </div>
              <div className="form-workbench-composition is-wide is-masks">
                <Card className={"pn-card"}>
                  {" "}
                  <CardHeader className={"pn-card-header"}>
                    {" "}
                    <CardTitle className={"pn-card-title"}>
                      {"Input mask"}
                    </CardTitle>{" "}
                  </CardHeader>{" "}
                  <CardContent className={"pn-card-body"}>
                    {" "}
                    <div className={"pn-mb-3"}>
                      {" "}
                      <label className={"pn-d-block"}>
                        {" "}
                        <span className={"pn-form-label"}>{" Date "}</span>{" "}
                        <WorkspaceInput
                          type={"text"}
                          name={"input-mask"}
                          className={"pn-form-control"}
                          data-mask={"00/00/0000"}
                          data-mask-visible={"true"}
                          placeholder={"00/00/0000"}
                          autoComplete={"off"}
                        />{" "}
                      </label>{" "}
                    </div>{" "}
                    <div className={"pn-mb-3"}>
                      {" "}
                      <label className={"pn-d-block"}>
                        {" "}
                        <span className={"pn-form-label"}>{" Hour "}</span>{" "}
                        <WorkspaceInput
                          type={"text"}
                          name={"input-mask"}
                          className={"pn-form-control"}
                          data-mask={"00:00:00"}
                          data-mask-visible={"true"}
                          placeholder={"00:00:00"}
                          autoComplete={"off"}
                        />{" "}
                      </label>{" "}
                    </div>{" "}
                    <div className={"pn-mb-3"}>
                      {" "}
                      <label className={"pn-d-block"}>
                        {" "}
                        <span className={"pn-form-label"}>
                          {" Date & Hour "}
                        </span>{" "}
                        <WorkspaceInput
                          type={"text"}
                          name={"input-mask"}
                          className={"pn-form-control"}
                          data-mask={"00/00/0000 00:00:00"}
                          data-mask-visible={"true"}
                          placeholder={"00/00/0000 00:00:00"}
                          autoComplete={"off"}
                        />{" "}
                      </label>{" "}
                    </div>{" "}
                    <div className={"pn-mb-3"}>
                      {" "}
                      <label className={"pn-d-block"}>
                        {" "}
                        <span className={"pn-form-label"}>
                          {" ZIP Code "}
                        </span>{" "}
                        <WorkspaceInput
                          type={"text"}
                          name={"input-mask"}
                          className={"pn-form-control"}
                          data-mask={"00000-000"}
                          data-mask-visible={"true"}
                          placeholder={"00000-000"}
                          autoComplete={"off"}
                        />{" "}
                      </label>{" "}
                    </div>{" "}
                    <div className={"pn-mb-3"}>
                      {" "}
                      <label className={"pn-d-block"}>
                        {" "}
                        <span className={"pn-form-label"}>
                          {" Money "}
                        </span>{" "}
                        <WorkspaceInput
                          type={"text"}
                          name={"input-mask"}
                          className={"pn-form-control"}
                          data-mask={"000.000.000.000.000,00"}
                          data-mask-visible={"true"}
                          placeholder={"000.000.000.000.000,00"}
                          data-mask-reverse={"true"}
                          autoComplete={"off"}
                        />{" "}
                      </label>{" "}
                    </div>{" "}
                    <div className={"pn-mb-3"}>
                      {" "}
                      <label className={"pn-d-block"}>
                        {" "}
                        <span className={"pn-form-label"}>
                          {" Telephone "}
                        </span>{" "}
                        <WorkspaceInput
                          type={"text"}
                          name={"input-mask"}
                          className={"pn-form-control"}
                          data-mask={"0000-0000"}
                          data-mask-visible={"true"}
                          placeholder={"0000-0000"}
                          autoComplete={"off"}
                        />{" "}
                      </label>{" "}
                    </div>{" "}
                    <div className={"pn-mb-3"}>
                      {" "}
                      <label className={"pn-d-block"}>
                        {" "}
                        <span className={"pn-form-label"}>
                          {" Telephone with Code Area "}
                        </span>{" "}
                        <WorkspaceInput
                          type={"text"}
                          name={"input-mask"}
                          className={"pn-form-control"}
                          data-mask={"(00) 0000-0000"}
                          data-mask-visible={"true"}
                          placeholder={"(00) 0000-0000"}
                          autoComplete={"off"}
                        />{" "}
                      </label>{" "}
                    </div>{" "}
                    <div className={"pn-mb-3"}>
                      {" "}
                      <label className={"pn-d-block"}>
                        {" "}
                        <span className={"pn-form-label"}>
                          {" IP Address "}
                        </span>{" "}
                        <WorkspaceInput
                          type={"text"}
                          name={"input-mask"}
                          className={"pn-form-control"}
                          data-mask={"099.099.099.099"}
                          data-mask-visible={"true"}
                          placeholder={"000.000.000.000"}
                          autoComplete={"off"}
                        />{" "}
                      </label>{" "}
                    </div>{" "}
                  </CardContent>{" "}
                </Card>
              </div>
              <div className="form-workbench-composition is-wide">
                <WorkspaceForm className={"pn-card"}>
                  {" "}
                  <CardContent className={"pn-card-body"}>
                    {" "}
                    <CardTitle className={"pn-card-title"}>
                      {"Edit Profile"}
                    </CardTitle>{" "}
                    <div className={"pn-row pn-row-cards"}>
                      {" "}
                      <div className={"pn-col-md-5"}>
                        {" "}
                        <div className={"pn-mb-3"}>
                          {" "}
                          <label className={"pn-d-block"}>
                            {" "}
                            <span className={"pn-form-label"}>
                              {" Company "}
                            </span>{" "}
                            <WorkspaceInput
                              type={"text"}
                              className={"pn-form-control"}
                              disabled
                              placeholder={"Company"}
                              defaultValue={"Creative Code Inc."}
                            />{" "}
                          </label>{" "}
                        </div>{" "}
                      </div>{" "}
                      <div className={"pn-col-sm-6 pn-col-md-3"}>
                        {" "}
                        <div className={"pn-mb-3"}>
                          {" "}
                          <label className={"pn-d-block"}>
                            {" "}
                            <span className={"pn-form-label"}>
                              {" Username "}
                            </span>{" "}
                            <WorkspaceInput
                              type={"text"}
                              className={"pn-form-control"}
                              placeholder={"Username"}
                              defaultValue={"michael23"}
                            />{" "}
                          </label>{" "}
                        </div>{" "}
                      </div>{" "}
                      <div className={"pn-col-sm-6 pn-col-md-4"}>
                        {" "}
                        <div className={"pn-mb-3"}>
                          {" "}
                          <label className={"pn-d-block"}>
                            {" "}
                            <span className={"pn-form-label"}>
                              {" Email address "}
                            </span>{" "}
                            <WorkspaceInput
                              type={"email"}
                              className={"pn-form-control"}
                              placeholder={"Email"}
                            />{" "}
                          </label>{" "}
                        </div>{" "}
                      </div>{" "}
                      <div className={"pn-col-sm-6 pn-col-md-6"}>
                        {" "}
                        <div className={"pn-mb-3"}>
                          {" "}
                          <label className={"pn-d-block"}>
                            {" "}
                            <span className={"pn-form-label"}>
                              {" First Name "}
                            </span>{" "}
                            <WorkspaceInput
                              type={"text"}
                              className={"pn-form-control"}
                              placeholder={"Company"}
                              defaultValue={"Chet"}
                            />{" "}
                          </label>{" "}
                        </div>{" "}
                      </div>{" "}
                      <div className={"pn-col-sm-6 pn-col-md-6"}>
                        {" "}
                        <div className={"pn-mb-3"}>
                          {" "}
                          <label className={"pn-d-block"}>
                            {" "}
                            <span className={"pn-form-label"}>
                              {" Last Name "}
                            </span>{" "}
                            <WorkspaceInput
                              type={"text"}
                              className={"pn-form-control"}
                              placeholder={"Last Name"}
                              defaultValue={"Faker"}
                            />{" "}
                          </label>{" "}
                        </div>{" "}
                      </div>{" "}
                      <div className={"pn-col-md-12"}>
                        {" "}
                        <div className={"pn-mb-3"}>
                          {" "}
                          <label className={"pn-d-block"}>
                            {" "}
                            <span className={"pn-form-label"}>
                              {" Address "}
                            </span>{" "}
                            <WorkspaceInput
                              type={"text"}
                              className={"pn-form-control"}
                              placeholder={"Home Address"}
                              defaultValue={"Melbourne, Australia"}
                            />{" "}
                          </label>{" "}
                        </div>{" "}
                      </div>{" "}
                      <div className={"pn-col-sm-6 pn-col-md-4"}>
                        {" "}
                        <div className={"pn-mb-3"}>
                          {" "}
                          <label className={"pn-d-block"}>
                            {" "}
                            <span className={"pn-form-label"}>
                              {" City "}
                            </span>{" "}
                            <WorkspaceInput
                              type={"text"}
                              className={"pn-form-control"}
                              placeholder={"City"}
                              defaultValue={"Melbourne"}
                            />{" "}
                          </label>{" "}
                        </div>{" "}
                      </div>{" "}
                      <div className={"pn-col-sm-6 pn-col-md-3"}>
                        {" "}
                        <div className={"pn-mb-3"}>
                          {" "}
                          <label className={"pn-d-block"}>
                            {" "}
                            <span className={"pn-form-label"}>
                              {" Postal Code "}
                            </span>{" "}
                            <WorkspaceInput
                              type={"text"}
                              className={"pn-form-control"}
                              placeholder={"ZIP Code"}
                            />{" "}
                          </label>{" "}
                        </div>{" "}
                      </div>{" "}
                      <div className={"pn-col-md-5"}>
                        {" "}
                        <div className={"pn-mb-3"}>
                          {" "}
                          <label className={"pn-d-block"}>
                            {" "}
                            <span className={"pn-form-label"}>
                              {" Country "}
                            </span>{" "}
                            <WorkspaceSelect
                              className={"pn-form-control pn-form-select"}
                            >
                              <option value={""}>{"Germany"}</option>
                            </WorkspaceSelect>{" "}
                          </label>{" "}
                        </div>{" "}
                      </div>{" "}
                      <div className={"pn-col-md-12"}>
                        {" "}
                        <div className={"pn-mb-3 pn-mb-0"}>
                          {" "}
                          <label className={"pn-d-block"}>
                            {" "}
                            <span className={"pn-form-label"}>
                              {" About Me "}
                            </span>{" "}
                            <WorkspaceTextarea
                              rows={5}
                              className={"pn-form-control"}
                              placeholder={"Here can be your description"}
                              defaultValue={
                                "Oh so, your weak rhyme You doubt I'll bother, reading into it I'll probably won't, left to my own devices But that's the difference in our opinions."
                              }
                            />{" "}
                          </label>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                  </CardContent>{" "}
                  <CardFooter className={"pn-card-footer pn-text-end"}>
                    {" "}
                    <WorkspaceButton
                      type={"submit"}
                      className={"pn-btn pn-btn-primary"}
                    >
                      {"Update Profile"}
                    </WorkspaceButton>{" "}
                  </CardFooter>{" "}
                </WorkspaceForm>
              </div>
              <div className="form-workbench-composition is-wide">
                <Card className={"pn-card pn-h-100"}>
                  {" "}
                  <CardHeader className={"pn-card-header"}>
                    {" "}
                    <CardTitle className={"pn-card-title"}>
                      {"HTTP Request"}
                    </CardTitle>{" "}
                  </CardHeader>{" "}
                  <CardContent className={"pn-card-body"}>
                    {" "}
                    <div className={"pn-row pn-row-cards"}>
                      {" "}
                      <div className={"pn-mb-3 pn-col-sm-4 pn-col-md-2"}>
                        {" "}
                        <label className={"pn-d-block"}>
                          {" "}
                          <span className={"pn-form-label pn-required"}>
                            {" Method "}
                            <span className={"pn-visually-hidden"}>
                              {" (required)"}
                            </span>{" "}
                          </span>{" "}
                          <WorkspaceSelect className={"pn-form-select"}>
                            <option value={"GET"}>{"GET"}</option>
                            <option value={"POST"}>{"POST"}</option>
                            <option value={"PUT"}>{"PUT"}</option>
                            <option value={"HEAD"}>{"HEAD"}</option>
                            <option value={"DELETE"}>{"DELETE"}</option>
                            <option value={"PATCH"}>{"PATCH"}</option>
                          </WorkspaceSelect>{" "}
                        </label>{" "}
                      </div>{" "}
                      <div className={"pn-mb-3 pn-col-sm-8 pn-col-md-10"}>
                        {" "}
                        <label className={"pn-d-block"}>
                          {" "}
                          <span className={"pn-form-label pn-required"}>
                            {" URL "}
                            <span className={"pn-visually-hidden"}>
                              {" (required)"}
                            </span>{" "}
                          </span>{" "}
                          <WorkspaceInput
                            name={"url"}
                            type={"text"}
                            className={"pn-form-control"}
                            defaultValue={
                              "https://content.googleapis.com/discovery/v1/apis/surveys/v2/rest"
                            }
                          />{" "}
                        </label>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className={"pn-form-label"}>{"Assertions"}</div>{" "}
                    <div className={"pn-table-responsive"}>
                      {" "}
                      <table className={"pn-table pn-mb-0"}>
                        <thead>
                          <tr>
                            <th>{"Source"}</th>
                            <th>{"Property"}</th>
                            <th>{"Comparison"}</th>
                            <th>{"Target"}</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              {" "}
                              <WorkspaceSelect
                                className={"pn-form-select"}
                                defaultValue={"STATUS_CODE"}
                              >
                                <option value={"STATUS_CODE"}>
                                  {"Status code"}
                                </option>
                                <option value={"JSON_BODY"}>
                                  {"JSON body"}
                                </option>
                                <option value={"HEADERS"}>{"Headers"}</option>
                                <option value={"TEXT_BODY"}>
                                  {"Text body"}
                                </option>
                                <option value={"RESPONSE_TIME"}>
                                  {"Response time"}
                                </option>
                              </WorkspaceSelect>{" "}
                            </td>
                            <td>
                              {" "}
                              <WorkspaceInput
                                type={"text"}
                                className={"pn-form-control"}
                              />{" "}
                            </td>
                            <td>
                              {" "}
                              <WorkspaceSelect
                                className={"pn-form-select"}
                                defaultValue={"EQUALS"}
                              >
                                <option value={"EQUALS"}>{"Equals"}</option>
                                <option value={"NOT_EQUALS"}>
                                  {"Not equals"}
                                </option>
                                <option value={"HAS_KEY"}>{"Has key"}</option>
                                <option value={"NOT_HAS_KEY"}>
                                  {"Not has key"}
                                </option>
                                <option value={"HAS_VALUE"}>
                                  {"Has value"}
                                </option>
                                <option value={"NOT_HAS_VALUE"}>
                                  {"Not has value"}
                                </option>
                                <option value={"IS_EMPTY"}>{"Is empty"}</option>
                                <option value={"NOT_EMPTY"}>
                                  {"Is not empty"}
                                </option>
                                <option value={"GREATER_THAN"}>
                                  {"Greater than"}
                                </option>
                                <option value={"LESS_THAN"}>
                                  {"Less than"}
                                </option>
                              </WorkspaceSelect>{" "}
                            </td>
                            <td>
                              {" "}
                              <WorkspaceInput
                                type={"text"}
                                className={"pn-form-control"}
                                defaultValue={"200"}
                              />{" "}
                            </td>
                          </tr>
                          <tr>
                            <td>
                              {" "}
                              <WorkspaceSelect
                                className={"pn-form-select"}
                                defaultValue={"JSON_BODY"}
                              >
                                <option value={"STATUS_CODE"}>
                                  {"Status code"}
                                </option>
                                <option value={"JSON_BODY"}>
                                  {"JSON body"}
                                </option>
                                <option value={"HEADERS"}>{"Headers"}</option>
                                <option value={"TEXT_BODY"}>
                                  {"Text body"}
                                </option>
                                <option value={"RESPONSE_TIME"}>
                                  {"Response time"}
                                </option>
                              </WorkspaceSelect>{" "}
                            </td>
                            <td>
                              {" "}
                              <WorkspaceInput
                                type={"text"}
                                className={"pn-form-control"}
                                defaultValue={"parameters.alt.type"}
                              />{" "}
                            </td>
                            <td>
                              {" "}
                              <WorkspaceSelect
                                className={"pn-form-select"}
                                defaultValue={"HAS_VALUE"}
                              >
                                <option value={"EQUALS"}>{"Equals"}</option>
                                <option value={"NOT_EQUALS"}>
                                  {"Not equals"}
                                </option>
                                <option value={"HAS_KEY"}>{"Has key"}</option>
                                <option value={"NOT_HAS_KEY"}>
                                  {"Not has key"}
                                </option>
                                <option value={"HAS_VALUE"}>
                                  {"Has value"}
                                </option>
                                <option value={"NOT_HAS_VALUE"}>
                                  {"Not has value"}
                                </option>
                                <option value={"IS_EMPTY"}>{"Is empty"}</option>
                                <option value={"NOT_EMPTY"}>
                                  {"Is not empty"}
                                </option>
                                <option value={"GREATER_THAN"}>
                                  {"Greater than"}
                                </option>
                                <option value={"LESS_THAN"}>
                                  {"Less than"}
                                </option>
                              </WorkspaceSelect>{" "}
                            </td>
                            <td>
                              {" "}
                              <WorkspaceInput
                                type={"text"}
                                className={"pn-form-control"}
                                defaultValue={"string"}
                              />{" "}
                            </td>
                          </tr>
                          <tr>
                            <td>
                              {" "}
                              <WorkspaceSelect
                                className={"pn-form-select"}
                                defaultValue={"RESPONSE_TIME"}
                              >
                                <option value={"STATUS_CODE"}>
                                  {"Status code"}
                                </option>
                                <option value={"JSON_BODY"}>
                                  {"JSON body"}
                                </option>
                                <option value={"HEADERS"}>{"Headers"}</option>
                                <option value={"TEXT_BODY"}>
                                  {"Text body"}
                                </option>
                                <option value={"RESPONSE_TIME"}>
                                  {"Response time"}
                                </option>
                              </WorkspaceSelect>{" "}
                            </td>
                            <td>
                              {" "}
                              <WorkspaceInput
                                type={"text"}
                                className={"pn-form-control"}
                              />{" "}
                            </td>
                            <td>
                              {" "}
                              <WorkspaceSelect
                                className={"pn-form-select"}
                                defaultValue={"LESS_THAN"}
                              >
                                <option value={"EQUALS"}>{"Equals"}</option>
                                <option value={"NOT_EQUALS"}>
                                  {"Not equals"}
                                </option>
                                <option value={"HAS_KEY"}>{"Has key"}</option>
                                <option value={"NOT_HAS_KEY"}>
                                  {"Not has key"}
                                </option>
                                <option value={"HAS_VALUE"}>
                                  {"Has value"}
                                </option>
                                <option value={"NOT_HAS_VALUE"}>
                                  {"Not has value"}
                                </option>
                                <option value={"IS_EMPTY"}>{"Is empty"}</option>
                                <option value={"NOT_EMPTY"}>
                                  {"Is not empty"}
                                </option>
                                <option value={"GREATER_THAN"}>
                                  {"Greater than"}
                                </option>
                                <option value={"LESS_THAN"}>
                                  {"Less than"}
                                </option>
                              </WorkspaceSelect>{" "}
                            </td>
                            <td>
                              {" "}
                              <WorkspaceInput
                                type={"text"}
                                className={"pn-form-control"}
                                defaultValue={"500"}
                              />{" "}
                            </td>
                          </tr>
                          <tr>
                            <td>
                              {" "}
                              <WorkspaceSelect
                                className={"pn-form-select"}
                                defaultValue={"HEADERS"}
                              >
                                <option value={"STATUS_CODE"}>
                                  {"Status code"}
                                </option>
                                <option value={"JSON_BODY"}>
                                  {"JSON body"}
                                </option>
                                <option value={"HEADERS"}>{"Headers"}</option>
                                <option value={"TEXT_BODY"}>
                                  {"Text body"}
                                </option>
                                <option value={"RESPONSE_TIME"}>
                                  {"Response time"}
                                </option>
                              </WorkspaceSelect>{" "}
                            </td>
                            <td>
                              {" "}
                              <WorkspaceInput
                                type={"text"}
                                className={"pn-form-control"}
                                defaultValue={"content-type"}
                              />{" "}
                            </td>
                            <td>
                              {" "}
                              <WorkspaceSelect
                                className={"pn-form-select"}
                                defaultValue={"EQUALS"}
                              >
                                <option value={"EQUALS"}>{"Equals"}</option>
                                <option value={"NOT_EQUALS"}>
                                  {"Not equals"}
                                </option>
                                <option value={"HAS_KEY"}>{"Has key"}</option>
                                <option value={"NOT_HAS_KEY"}>
                                  {"Not has key"}
                                </option>
                                <option value={"HAS_VALUE"}>
                                  {"Has value"}
                                </option>
                                <option value={"NOT_HAS_VALUE"}>
                                  {"Not has value"}
                                </option>
                                <option value={"IS_EMPTY"}>{"Is empty"}</option>
                                <option value={"NOT_EMPTY"}>
                                  {"Is not empty"}
                                </option>
                                <option value={"GREATER_THAN"}>
                                  {"Greater than"}
                                </option>
                                <option value={"LESS_THAN"}>
                                  {"Less than"}
                                </option>
                              </WorkspaceSelect>{" "}
                            </td>
                            <td>
                              {" "}
                              <WorkspaceInput
                                type={"text"}
                                className={"pn-form-control"}
                                defaultValue={"application/json; charset=UTF-8"}
                              />{" "}
                            </td>
                          </tr>
                        </tbody>
                      </table>{" "}
                    </div>{" "}
                  </CardContent>{" "}
                  <CardFooter className={"pn-card-footer pn-text-end"}>
                    {" "}
                    <WorkspaceButton
                      type={"submit"}
                      className={"pn-btn pn-btn-primary"}
                    >
                      {"Make request"}
                    </WorkspaceButton>{" "}
                  </CardFooter>{" "}
                </Card>
              </div>
            </div>
          </section>
        </div>
        <p className="form-workbench-note">
          Interactive examples · Changes stay in this demo.
        </p>
      </div>
    </div>
  );
}
