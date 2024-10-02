import Script from "next/script";
import React from "react";

const GoogleTag = () => {
  return (
    <>
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-5NNS19FKLN" />
      <Script
        id="gtag-init"
        dangerouslySetInnerHTML={{
          __html: `
                 window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', 'G-5NNS19FKLN');
            `,
        }}
      />
    </>
  );
};

export default GoogleTag;
