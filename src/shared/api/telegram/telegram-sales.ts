const baseUrlSales =
  "https://api.telegram.org/bot7548029831:AAGwcz-WUeEof3ji6ONoTuYTKs3-8GYaR3Q/";
 const baseUrlSupport =
  "https://api.telegram.org/bot8052730080:AAHpGwBK8S9dtRGSlNVMBX-qsjKpn36yqpA/";
export const sendSalesMessageTelegram = async (
  message: string,
  variant?:string,
): Promise<void> => {
  console.log(baseUrlSupport);
  const url: string = variant == 'support' ? `${baseUrlSupport}sendMessage?chat_id=553783325&text=${message}` : `${baseUrlSales}sendMessage?chat_id=-4625445465&text=${message}`;

 await fetch(url);
};
