import{r as m,_ as s}from"./index-DF1D02Hj.js";import{P as e}from"./useThemeProps-B6NQfqaC.js";import{u as d,r,a as b,s as f,v as T}from"./AdapterDayjs-C9hUxPF7.js";const P=m.forwardRef(function(i,c){var n;const o=d(i,"MuiStaticTimePicker"),t=o.displayStaticWrapperAs??"mobile",a=o.ampmInClock??t==="desktop",l=s({hours:r,minutes:r,seconds:r},o.viewRenderers),u=s({},o,{viewRenderers:l,displayStaticWrapperAs:t,ampmInClock:a,slotProps:s({},o.slotProps,{toolbar:s({hidden:t==="desktop",ampmInClock:a},(n=o.slotProps)==null?void 0:n.toolbar)})}),{renderPicker:p}=b({props:u,valueManager:f,valueType:"time",validator:T,ref:c});return p()});P.propTypes={ampm:e.bool,ampmInClock:e.bool,autoFocus:e.bool,className:e.string,defaultValue:e.object,disabled:e.bool,disableFuture:e.bool,disableIgnoringDatePartForTimeValidation:e.bool,disablePast:e.bool,displayStaticWrapperAs:e.oneOf(["desktop","mobile"]),localeText:e.object,maxTime:e.object,minTime:e.object,minutesStep:e.number,onAccept:e.func,onChange:e.func,onClose:e.func,onError:e.func,onViewChange:e.func,openTo:e.oneOf(["hours","minutes","seconds"]),orientation:e.oneOf(["landscape","portrait"]),readOnly:e.bool,reduceAnimations:e.bool,referenceDate:e.object,shouldDisableTime:e.func,slotProps:e.object,slots:e.object,sx:e.oneOfType([e.arrayOf(e.oneOfType([e.func,e.object,e.bool])),e.func,e.object]),timezone:e.string,value:e.object,view:e.oneOf(["hours","minutes","seconds"]),viewRenderers:e.shape({hours:e.func,minutes:e.func,seconds:e.func}),views:e.arrayOf(e.oneOf(["hours","minutes","seconds"]).isRequired)};export{P as S};
