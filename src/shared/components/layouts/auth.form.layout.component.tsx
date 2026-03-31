import React from "react";

interface AuthFormLayoutProps {
  heading?: string;
  subHeading?: string;
  form: React.ReactNode;
}

function AuthFormLayout({ heading, subHeading, form }: AuthFormLayoutProps) {
  return (
    <div className="">
      <div className=" mb-8 flex flex-col gap-2">
        {heading && (
          <h1 className="text-4xl font-semibold text-foreground">{heading}</h1>
        )}
        {subHeading && (
          <p className=" text-muted-foreground text-[1rem] font-normal">
            {subHeading}
          </p>
        )}
      </div>

      {<>{form}</>}
    </div>
  );
}

export default AuthFormLayout;
