import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export default getRequestConfig(async () => {
  // Use cookies to determine locale, default to 'ko' for domestic expansion
  const cookieStore = await cookies();
  let locale = cookieStore.get('NEXT_LOCALE')?.value || 'ko';

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
