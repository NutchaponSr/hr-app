interface Props {
  title: string;
  children: React.ReactNode;
}

export const AuthCard = ({ children, title }: Props) => {
  return (
    <div className="flex flex-col items-center">
      <div className="mt-[10vh] mb-6 max-w-90">
        <div className="flex flex-col text-left w-80">
          <h1 className="leading-6 font-semibold text-2xl text-primary">
            {title}
          </h1>
        </div>
      </div>
      <div className="w-full flex flex-col items-center max-w-80 mb-[4vh] space-y-3">
        <div className="flex w-full flex-col">
          <div className="flex flex-col w-full h-8" />
          {children}
        </div>
        <div className="w-full text-center text-balance text-tertiary text-xs leading-4 mt-2">
          เมื่อดำเนินการต่อ แสดงว่าคุณเข้าใจและยอมรับข้อกำหนดและเงื่อนไขและนโยบายความเป็นส่วนตัว
        </div>
      </div>
    </div>
  );
}