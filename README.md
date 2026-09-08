# Velora — Carpet Cleaning

## Начало работы
Загрузите содержимое этой папки в корень сайта. Рядом должны находиться index.html, contact.php, config/ и assets/. Для формы требуется PHP 8.1+ и настроенная почтовая отправка mail() на сервере.

## Структура
- index.html — главная: хиро и 17 секций.
- carpet-cleaning.html, rug-cleaning.html — услуги: хиро и по 8 секций.
- privacy.html, terms.html, cookies.html — правовые страницы.
- contact.php — серверная обработка формы.
- config/config.js — единые настройки бренда и почты.
- assets/css/main.css — базовый дизайн, компоненты, хиро, правовые страницы.
- assets/css/responsive.css — адаптация и уменьшение анимаций.
- assets/js/config-bindings.js — применение конфигурации.
- assets/js/navigation.js — меню, переходы, cookie preferences.
- assets/js/motion.js — печать заголовков, свайперы, вкладки, параллакс.
- assets/css/carpet-interactions.css — фактуры хиро, объемные образцы и новые эффекты.
- assets/js/carpet-interactions.js — пять видов ковров, до/после и интерактивная губка.
- assets/js/contact.js — отправка формы и статусы.
- assets/images/home/, services/, shared/ — фотографии по назначению.
- assets/icons/, fonts/, vendor/ — локальные иконки, шрифты и библиотеки.

## Конфиг
В config/config.js меняются companyName, companyShortName, logo, favicon, email, browserTitle, pageTitles, disclaimer, copyright, contactSuccessMessage.
Название компании — HTML-текст отдельно от картинки логотипа. Настройки применяются на всех страницах.
Сохраняйте формат window.SiteConfig = { JSON }; — двойные кавычки, без комментариев внутри объекта и без завершающих запятых. PHP читает этот же файл как данные.

## Форма и временный email
hello@velora.example — заглушка. Для отправки замените email на рабочий ящик своего домена и настройте mail() у хостера. Этот адрес используется как получатель и From, адрес посетителя — как Reply-To.
Успех показывается только после положительного ответа PHP и mail(). Принятие сервером не гарантирует доставку в почтовый ящик.
Live Server и приватный статический предпросмотр не выполняют PHP. Для локальной проверки PHP можно использовать php -S localhost:8000 из этой папки. Реальную доставку проверяют на целевом хостинге.

## Анимации
Заголовки хиро печатаются по символам с заранее занятой высотой. Пылесос проходит слева направо и повторяет путь за краями экрана. Бегущая строка состоит из двух одинаковых групп без скачка на стыке. Все свайперы используют loop и шесть уникальных карточек. Поддерживается prefers-reduced-motion.

## Фотографии
Генерированные изображения удалены из этой версии. Использованы фотографии интерьеров и ухода за коврами из внешних источников; список находится в ASSETS.md. Три хиро используют разные фактуры ковров строго сверху, без мебели.

## Проверка
Проверены синтаксис JS, ссылки, якоря, локальные ресурсы, конфиг, количество секций и состав ZIP. В браузере проверены десктоп, мобильная и планшетная ширина, меню, полный круг свайпера, переключение ковров, до/после и губка. Реальная почтовая доставка не проверялась.

## Обновление оформления
Добавлены прайсинг с персональным расчетом, демонстрационные отзывы с паузой, блок ролей команды, фото-переключатель деталей и две композиции для услуг. Отзывы — явно отмеченные примеры, портреты — иллюстративные; замените их реальными данными перед использованием как представления своей команды и клиентов.
refinements.css и refinements.js содержат новые поверхности и взаимодействия. Переворот доступен при наведении, фокусе и нажатии. До/после реагирует также на наведение. Декорации не перехватывают прокрутку; вне экрана анимации приостанавливаются.
В браузере проверены ширины 375, 753 и 1348 px, новые переключатели, пауза отзывов и фотографии. Форма PHP и реальные почтовые настройки в этой итерации не изменялись; восстановлен отсутствовавший option Carpet cleaning.

## Последние визуальные правки
Полный пылесос с трубкой и насадкой перемещается слева направо за 14 секунд (11 секунд на мобильной ширине), с легким эффектом втягивания пыли. Команда повторяет композицию приложенного примера и использует его фотографии. Фото фоновой секции восстановлено из пользовательского скриншота без надписей. Под FAQ добавлено горизонтальное фото. Остальные декоративные кисточки заменены фотографиями микрофибры и распылителя.
Новые настройки оформления — assets/css/premium-care.css. Проверены локальные ресурсы и размещение декораций, а также десктопная, мобильная и планшетная ширина в браузере. Серверная отправка почты в этой итерации не менялась.

Revision 6: distinct Flaticon icons with footer credits; separate SVG background motion; compact heroes; accent text outline; vacuum favicon; viewport-triggered heading typing; raised editorial, pricing and team cards; photo section follows pricing.

Revision 7: new care photography, material photo tabs switching with text on hover/click/keyboard, descending muted rug card backgrounds, brush/foam card accents, animated hose/bucket/soap/extractor, hover scrub brush in preparation sections, enriched pricing/team/FAQ. Reduced motion and offscreen pausing retained.

Revision 8: transparent standalone animated objects; lower service hose; pricing/plan comparison with frequency selector and enquiry prefill that preserves user-written messages. Prices remain provider-confirmed custom quotes.
