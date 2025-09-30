import React from "react";
import { LayoutContentWrapper } from "./layoutWrapper.style";
import iconGo from "../../image/logoGo.png";
import '../../containers/Page/style.css';
const currentYear = new Date().getFullYear();
export default props => (
  <LayoutContentWrapper
    className={
      props.className != null
        ? `${props.className} isoLayoutContentWrapper`
        : "isoLayoutContentWrapper"
    }
    {...props}
  >
    {props.children}
    <div className="footer-main">
      <img src={iconGo} alt="" width={30} style={{marginRight: 10}}/>
      <i>Copyright © 2010-{currentYear} <b>GO SOLUTIONS</b>. All rights</i>
    </div>
  </LayoutContentWrapper>
);
