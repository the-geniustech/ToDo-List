import svgPaths from "./svg-hmsofe5zbr";

function Icon() {
  return (
    <div className="opacity-50 relative size-full" data-name="Icon">
      <div className="absolute inset-[12.5%]" data-name="Icon">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
          <path d={svgPaths.p39eaed80} fill="var(--fill-0, #1C1D22)" id="Icon" />
        </svg>
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative size-full" data-name="Icon">
      <div className="absolute inset-[8.333%]" data-name="Icon">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 17">
          <path d={svgPaths.p3eb95930} fill="var(--fill-0, #1C1D22)" id="Icon" />
        </svg>
      </div>
    </div>
  );
}

function Content() {
  return (
    <div className="absolute contents left-[194px] top-[963px]" data-name="Content">
      <div className="absolute font-['Exo_2:SemiBold',_sans-serif] font-semibold leading-[0] left-[220px] text-[14px] text-[rgba(28,29,34,0.5)] text-nowrap top-[966px]">
        <p className="leading-none whitespace-pre">Dark</p>
      </div>
      <div className="absolute left-[194px] opacity-50 overflow-clip size-5 top-[963px]" data-name="Icon">
        <Icon />
      </div>
    </div>
  );
}

function Item() {
  return (
    <div className="absolute contents left-[159px] top-[956px]" data-name="Item">
      <div className="absolute h-[34px] left-[159px] rounded-[18px] top-[956px] w-[127px]" data-name="Box" />
      <Content />
    </div>
  );
}

function Content1() {
  return (
    <div className="absolute contents left-[66px] top-[963px]" data-name="Content">
      <div className="absolute font-['Exo_2:SemiBold',_sans-serif] font-semibold leading-[0] left-[92px] text-[#1c1d22] text-[14px] text-nowrap top-[966px]">
        <p className="leading-none whitespace-pre">Light</p>
      </div>
      <div className="absolute left-[66px] overflow-clip size-5 top-[963px]" data-name="Icon">
        <Icon1 />
      </div>
    </div>
  );
}

function Item1() {
  return (
    <div className="absolute contents left-8 top-[956px]" data-name="Item">
      <div className="absolute bg-white h-[34px] left-8 rounded-[18px] shadow-[0px_8px_6px_0px_rgba(28,29,34,0.06)] top-[956px] w-[127px]" data-name="Box" />
      <Content1 />
    </div>
  );
}

function Items() {
  return (
    <div className="absolute contents left-8 top-[956px]" data-name="Items">
      <Item />
      <Item1 />
    </div>
  );
}

function Mode() {
  return (
    <div className="absolute contents left-7 top-[952px]" data-name="Mode">
      <div className="absolute bg-[rgba(28,29,34,0.04)] h-[42px] left-7 rounded-[22px] top-[952px] w-[262px]" data-name="Box" />
      <Items />
    </div>
  );
}

function Item2() {
  return (
    <div className="absolute contents left-7 top-[656px]" data-name="Item">
      <div className="absolute h-2 left-[285px] top-[660px] w-1" data-name="Icon">
        <div className="absolute inset-[-12.5%_-25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 10">
            <path d="M1 1L5 5L1 9" id="Icon" stroke="var(--stroke-0, #1C1D22)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.5" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute font-['Exo_2:Bold',_sans-serif] font-bold leading-[0] left-7 text-[16px] text-[rgba(28,29,34,0.5)] text-nowrap top-[656px]">
        <p className="leading-none whitespace-pre" dir="auto">
          Messengers
        </p>
      </div>
    </div>
  );
}

function Item3() {
  return (
    <div className="absolute contents left-7 top-[612px]" data-name="Item">
      <div className="absolute h-2 left-[285px] top-[616px] w-1" data-name="Icon">
        <div className="absolute inset-[-12.5%_-25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 10">
            <path d="M1 1L5 5L1 9" id="Icon" stroke="var(--stroke-0, #1C1D22)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.5" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute font-['Exo_2:Bold',_sans-serif] font-bold leading-[0] left-7 text-[16px] text-[rgba(28,29,34,0.5)] text-nowrap top-[612px]">
        <p className="leading-none whitespace-pre" dir="auto">
          Reminders
        </p>
      </div>
    </div>
  );
}

function Item4() {
  return (
    <div className="absolute box-border content-stretch flex gap-2.5 items-start justify-start left-[52px] px-[18px] py-2.5 rounded-[18px] top-[548px]" data-name="Item">
      <div className="font-['Exo_2:SemiBold',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[16px] text-[rgba(28,29,34,0.5)] text-nowrap">
        <p className="leading-none whitespace-pre" dir="auto">
          Done (3)
        </p>
      </div>
    </div>
  );
}

function Item5() {
  return (
    <div className="absolute bg-[rgba(28,29,34,0.04)] box-border content-stretch flex gap-2.5 items-start justify-start left-[52px] px-[18px] py-2.5 rounded-[18px] top-[502px]" data-name="Item">
      <div className="font-['Exo_2:SemiBold',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[#1c1d22] text-[16px] text-nowrap">
        <p className="leading-none whitespace-pre" dir="auto">
          In progress (4)
        </p>
      </div>
    </div>
  );
}

function Item6() {
  return (
    <div className="absolute box-border content-stretch flex gap-2.5 items-start justify-start left-[52px] px-[18px] py-2.5 rounded-[18px] top-[456px]" data-name="Item">
      <div className="font-['Exo_2:SemiBold',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[16px] text-[rgba(28,29,34,0.5)] text-nowrap">
        <p className="leading-none whitespace-pre" dir="auto">
          To do (4)
        </p>
      </div>
    </div>
  );
}

function Item7() {
  return (
    <div className="absolute box-border content-stretch flex gap-2.5 items-start justify-start left-[52px] px-[18px] py-2.5 rounded-[18px] top-[410px]" data-name="Item">
      <div className="font-['Exo_2:SemiBold',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[16px] text-[rgba(28,29,34,0.5)] text-nowrap">
        <p className="leading-none whitespace-pre" dir="auto">
          All tasks (11)
        </p>
      </div>
    </div>
  );
}

function Items1() {
  return (
    <div className="absolute contents left-[52px] top-[410px]" data-name="Items">
      <Item4 />
      <Item5 />
      <Item6 />
      <Item7 />
    </div>
  );
}

function Lines() {
  return (
    <div className="absolute h-[174px] left-[29px] top-[410px] w-[15px]" data-name="Lines">
      <div className="absolute bottom-0 left-[-6.67%] right-0 top-0">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 174">
          <g id="Lines">
            <path d="M2 156H16" id="Vector" stroke="var(--stroke-0, #1C1D22)" strokeLinejoin="round" strokeOpacity="0.1" strokeWidth="2" />
            <path d="M2 112H16" id="Vector_2" stroke="var(--stroke-0, #1C1D22)" strokeLinejoin="round" strokeOpacity="0.1" strokeWidth="2" />
            <path d="M2 64H16" id="Vector_3" stroke="var(--stroke-0, #1C1D22)" strokeLinejoin="round" strokeOpacity="0.1" strokeWidth="2" />
            <path d="M2 18H16" id="Vector_4" stroke="var(--stroke-0, #1C1D22)" strokeLinejoin="round" strokeOpacity="0.1" strokeWidth="2" />
            <path d="M1 0L1.00001 174" id="Vector_5" stroke="var(--stroke-0, #1C1D22)" strokeLinejoin="round" strokeOpacity="0.1" strokeWidth="2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Sub() {
  return (
    <div className="absolute contents left-[29px] top-[410px]" data-name="Sub">
      <Items1 />
      <Lines />
    </div>
  );
}

function Title() {
  return (
    <div className="absolute contents left-7 top-[378px]" data-name="Title">
      <div className="absolute flex h-[4px] items-center justify-center left-[281px] top-96 w-[8px]">
        <div className="flex-none rotate-[90deg]">
          <div className="h-2 relative w-1" data-name="Icon">
            <div className="absolute inset-[-12.5%_-25%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 10">
                <path d="M1 1L5 5L1 9" id="Icon" stroke="var(--stroke-0, #1C1D22)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute font-['Exo_2:Bold',_sans-serif] font-bold leading-[0] left-7 text-[#1c1d22] text-[16px] text-nowrap top-[378px]">
        <p className="leading-none whitespace-pre" dir="auto">
          Tasks
        </p>
      </div>
    </div>
  );
}

function Item8() {
  return (
    <div className="absolute contents left-7 top-[378px]" data-name="Item">
      <Sub />
      <Title />
    </div>
  );
}

function Item9() {
  return (
    <div className="absolute box-border content-stretch flex gap-2.5 items-start justify-start left-[52px] px-[18px] py-2.5 rounded-[18px] top-[314px]" data-name="Item">
      <div className="font-['Exo_2:SemiBold',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[16px] text-[rgba(28,29,34,0.5)] text-nowrap">
        <p className="leading-none whitespace-pre" dir="auto">
          Ux research
        </p>
      </div>
    </div>
  );
}

function Item10() {
  return (
    <div className="absolute box-border content-stretch flex gap-2.5 items-start justify-start left-[52px] px-[18px] py-2.5 rounded-[18px] top-[268px]" data-name="Item">
      <div className="font-['Exo_2:SemiBold',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[16px] text-[rgba(28,29,34,0.5)] text-nowrap">
        <p className="leading-none whitespace-pre" dir="auto">
          User flow
        </p>
      </div>
    </div>
  );
}

function Item11() {
  return (
    <div className="absolute bg-[rgba(28,29,34,0.04)] box-border content-stretch flex gap-2.5 items-start justify-start left-[52px] px-[18px] py-2.5 rounded-[18px] top-[222px]" data-name="Item">
      <div className="font-['Exo_2:SemiBold',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[#1c1d22] text-[16px] text-nowrap">
        <p className="leading-none whitespace-pre" dir="auto">
          Design system
        </p>
      </div>
    </div>
  );
}

function Item12() {
  return (
    <div className="absolute box-border content-stretch flex gap-2.5 items-start justify-start left-[52px] px-[18px] py-2.5 rounded-[18px] top-44" data-name="Item">
      <div className="font-['Exo_2:SemiBold',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[16px] text-[rgba(28,29,34,0.5)] text-nowrap">
        <p className="leading-none whitespace-pre" dir="auto">
          All projects (3)
        </p>
      </div>
    </div>
  );
}

function Items2() {
  return (
    <div className="absolute contents left-[52px] top-44" data-name="Items">
      <Item9 />
      <Item10 />
      <Item11 />
      <Item12 />
    </div>
  );
}

function Lines1() {
  return (
    <div className="absolute h-[174px] left-[29px] top-44 w-[15px]" data-name="Lines">
      <div className="absolute bottom-0 left-[-6.67%] right-0 top-0">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 174">
          <g id="Lines">
            <path d="M2 156H16" id="Vector" stroke="var(--stroke-0, #1C1D22)" strokeLinejoin="round" strokeOpacity="0.1" strokeWidth="2" />
            <path d="M2 112H16" id="Vector_2" stroke="var(--stroke-0, #1C1D22)" strokeLinejoin="round" strokeOpacity="0.1" strokeWidth="2" />
            <path d="M2 64H16" id="Vector_3" stroke="var(--stroke-0, #1C1D22)" strokeLinejoin="round" strokeOpacity="0.1" strokeWidth="2" />
            <path d="M2 18H16" id="Vector_4" stroke="var(--stroke-0, #1C1D22)" strokeLinejoin="round" strokeOpacity="0.1" strokeWidth="2" />
            <path d="M1 0L1.00001 174" id="Vector_5" stroke="var(--stroke-0, #1C1D22)" strokeLinejoin="round" strokeOpacity="0.1" strokeWidth="2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Sub1() {
  return (
    <div className="absolute contents left-[29px] top-44" data-name="Sub">
      <Items2 />
      <Lines1 />
    </div>
  );
}

function Title1() {
  return (
    <div className="absolute contents left-7 top-36" data-name="Title">
      <div className="absolute flex h-[4px] items-center justify-center left-[281px] top-[150px] w-[8px]">
        <div className="flex-none rotate-[90deg]">
          <div className="h-2 relative w-1" data-name="Icon">
            <div className="absolute inset-[-12.5%_-25%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 10">
                <path d="M1 1L5 5L1 9" id="Icon" stroke="var(--stroke-0, #1C1D22)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute font-['Exo_2:Bold',_sans-serif] font-bold leading-[0] left-7 text-[#1c1d22] text-[16px] text-nowrap top-36">
        <p className="leading-none whitespace-pre">Projects</p>
      </div>
    </div>
  );
}

function Item13() {
  return (
    <div className="absolute contents left-7 top-36" data-name="Item">
      <Sub1 />
      <Title1 />
    </div>
  );
}

function Item14() {
  return (
    <div className="absolute contents left-7 top-[100px]" data-name="Item">
      <div className="absolute h-2 left-[285px] top-[104px] w-1" data-name="Icon">
        <div className="absolute inset-[-12.5%_-25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 10">
            <path d="M1 1L5 5L1 9" id="Icon" stroke="var(--stroke-0, #1C1D22)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.5" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute font-['Exo_2:Bold',_sans-serif] font-bold leading-[0] left-7 text-[16px] text-[rgba(28,29,34,0.5)] text-nowrap top-[100px]">
        <p className="leading-none whitespace-pre">Team</p>
      </div>
    </div>
  );
}

function Items3() {
  return (
    <div className="absolute contents left-7 top-[100px]" data-name="Items">
      <Item2 />
      <Item3 />
      <Item8 />
      <Item13 />
      <Item14 />
    </div>
  );
}

function Icon3() {
  return (
    <div className="absolute left-[262px] size-7 top-[33px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
        <g id="Icon">
          <circle cx="14" cy="14" fill="var(--fill-0, #1C1D22)" fillOpacity="0.08" id="Box" r="14" />
          <g id="Icon_2" opacity="0.4">
            <path d="M18 14L10 14" id="Vector" stroke="var(--stroke-0, #1C1D22)" strokeLinecap="round" strokeWidth="2" />
            <path d="M14 18L14 10" id="Vector_2" stroke="var(--stroke-0, #1C1D22)" strokeLinecap="round" strokeWidth="2" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Title2() {
  return (
    <div className="absolute contents left-7 top-8" data-name="Title">
      <Icon3 />
      <div className="absolute font-['Exo_2:Bold',_sans-serif] font-bold leading-[0] left-7 text-[#1c1d22] text-[30px] text-nowrap top-8">
        <p className="leading-none whitespace-pre">Projects️</p>
      </div>
    </div>
  );
}

export default function Projects() {
  return (
    <div className="relative size-full" data-name="Projects">
      <div className="absolute h-[1022px] left-0 top-0 w-[318px]" data-name="Box">
        <div className="absolute bottom-[-25.44%] left-[-12.58%] right-[-37.74%] top-0">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 478 1282">
            <g filter="url(#filter0_d_1_699)" id="Box">
              <path d="M40 0H358V1022H40V0Z" fill="var(--fill-0, white)" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="1282" id="filter0_d_1_699" width="478" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dx="40" dy="180" />
                <feGaussianBlur stdDeviation="40" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0.109804 0 0 0 0 0.113725 0 0 0 0 0.133333 0 0 0 0.06 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_1_699" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_1_699" mode="normal" result="shape" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
      <Mode />
      <Items3 />
      <Title2 />
    </div>
  );
}