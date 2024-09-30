import { getUserLocale } from '@/services/locale';
import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export default getRequestConfig(async ({ locale }) => {
    // Ngôn ngữ ban đầu của website
    // Giá trị này ta có thể lấy từ cookie người dùng chẳng hạn
    if (!locale.includes(locale as any)) notFound();
    return {
        messages: (await import(`../messages/${locale}.json`)).default
    };
});



