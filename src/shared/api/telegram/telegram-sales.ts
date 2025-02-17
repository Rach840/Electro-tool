const baseUrl =
  "https://api.telegram.org/bot7548029831:AAGwcz-WUeEof3ji6ONoTuYTKs3-8GYaR3Q/";

export const sendSalesMessageTelegram = async (
  message: string,
): Promise<void> => {
  console.log(message);
  const url: string = `${baseUrl}sendMessage?chat_id=-4625445465&text=${message}`;
  const responce: Response = await fetch(url);

  console.log(responce);
};
