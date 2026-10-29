// Application copy is separate from venue names, descriptions, and customer data.
const copy = `
Test card|بطاقة تجريبية
Pay by card|الدفع بالبطاقة
A final touch before kickoff.|خطوة أخيرة قبل بداية المباراة.
Your slot is on hold|فترتك محجوزة مؤقتاً
Complete payment before the countdown ends.|أكمل الدفع قبل انتهاء العد التنازلي.
FakeGateway test checkout|دفع تجريبي عبر FakeGateway
Your next match, all in one place.|كل تفاصيل مباراتك القادمة في مكان واحد.
Booking summary|ملخص الحجز
Checkout|إتمام الحجز
Card Payment|الدفع بالبطاقة
Cancellation policy|سياسة الإلغاء
24+ hours before kickoff|قبل البداية بـ24 ساعة أو أكثر
Everything paid is refunded. No commission.|يُسترد كل ما دفعته دون عمولة.
Less than 24 hours before kickoff|قبل البداية بأقل من 24 ساعة
The 30% deposit is retained. Any amount paid above it is refunded.|يُحتفظ بالعربون البالغ 30٪، ويُسترد أي مبلغ مدفوع يزيد عنه.
Venue or admin cancellation|إلغاء من المنشأة أو الإدارة
Everything paid is refunded.|يُسترد كل ما دفعته.
I accept the cancellation policy|أوافق على سياسة الإلغاء
Pay {{amount}} & book|ادفع {{amount}} واحجز
Reserving your slot…|جارٍ حجز الفترة…
Payment option|خيار الدفع
30% deposit|عربون 30٪
Pay in full|الدفع بالكامل
Pay now|ادفع الآن
Your match|مباراتك
Africa/Cairo time|بتوقيت القاهرة
ONE LAST STEP|باقي خطوة واحدة
Make it match time.|مباراتك على بُعد خطوة.
Hold expires in|تنتهي مهلة الحجز خلال
Checkout progress|خطوات إتمام الحجز
Slot reserved|الفترة محجوزة مؤقتاً
Payment details|بيانات الدفع
Confirmation|التأكيد
Booking total|إجمالي الحجز
Due at venue|المستحق في المنشأة
Use test card details. No real money will be charged.|استخدم بيانات بطاقة تجريبية. لن يتم خصم أموال حقيقية.
Retry payment|إعادة محاولة الدفع
Complete test payment|إتمام الدفع التجريبي
Payment submitted|تم إرسال عملية الدفع
Checking your booking confirmation…|جارٍ التحقق من تأكيد حجزك…
Enter exactly 3 digits|أدخل 3 أرقام بالضبط
Resolve dispute|حسم الاعتراض
Enter resolution note for {{decision}}.|أدخل ملاحظة القرار: {{decision}}.
Resolution note|ملاحظة القرار
Reject venue|رفض المنشأة
Suspend venue|تعليق المنشأة
Reject court|رفض الملعب
Reason|السبب
Enter rejection reason:|أدخل سبب الرفض:
Enter suspension reason:|أدخل سبب التعليق:
Enter reason for rejecting this court:|أدخل سبب رفض هذا الملعب:
Mark payout as paid|تسجيل التحويل كمدفوع
Payment reference|مرجع التحويل
Enter payment transaction reference (e.g. Bank Ref, InstaPay TXN):|أدخل مرجع عملية التحويل (مثل مرجع البنك أو رقم عملية إنستاباي):
Submit venue|إرسال المنشأة للمراجعة
Submit this venue for platform verification and public listing?|هل تريد إرسال المنشأة للتحقق من المنصة وإدراجها للعامة؟
Confirm|تأكيد
Search by code, venue, or player…|ابحث برمز الحجز أو المنشأة أو اللاعب…
No matching reservations|لا توجد حجوزات مطابقة
Try clearing your search or status filter.|جرّب مسح البحث أو فلتر الحالة.
Expired|منتهي الصلاحية
No-show pending|عدم حضور قيد المراجعة
No-show|عدم حضور
auto-refreshes every 10 seconds|يتم التحديث تلقائياً كل 10 ثوانٍ
! Ready to send your venue info?|! هل أنت مستعد لإرسال بيانات منشأتك؟
! Your owner account request has been approved by the Super Admin. Please fill in your venue details, upload 2 to 3 photos, and configure your first pitch.|! وافقت الإدارة على طلبك كمالك. أكمل بيانات المنشأة وارفع من صورتين إلى ثلاث صور وأضف ملعبك الأول.
% Platform Fee|٪ رسوم المنصة
(Cash)|(نقداً)
({{value0}}-a-side)|({{value0}} لاعبين لكل فريق)
). Court bookings can only be reserved by player accounts. Please log out and sign in with your player account to reserve.|). الحجز متاح لحسابات اللاعبين. سجّل خروجك ثم ادخل بحساب لاعب للحجز.
+ Add Walk-In Booking|+ إضافة حجز مباشر
+ Block Court|+ إغلاق فترة بالملعب
-a-side| لاعبين لكل فريق
. Open the link to activate your account.|. افتح الرابط لتفعيل حسابك.
. Super admin will review and either uphold or overturn the strike.|. ستراجع الإدارة المخالفة وتؤكدها أو تلغيها.
/6 Photos|/6 صور
/6 photos selected|/6 صور محددة
0 EGP (Settled)|0 ج.م (تمت التسوية)
0 strikes under appeal|لا توجد مخالفات قيد الاستئناف
01 · CHOOSE A COURT / PITCH|01 · اختر الملعب
01012345678 or +201012345678|01012345678 أو +201012345678
02 · SELECT MATCH DAY|02 · اختر يوم المباراة
03 · CHECKOUT & PAYMENT|03 · إتمام الحجز والدفع
03 · SELECT MATCH HOURS|03 · اختر ساعات المباراة
1 hour selected|تم اختيار ساعة واحدة
1. Venue Identity & Location|1. بيانات المنشأة وموقعها
10 min|10 دقائق
11-a-side|11 لاعباً لكل فريق
2 Hours|ساعتان
2. Venue Photos (Min 2, Max 6) *|2. صور المنشأة (من صورتين إلى 6 صور) *
24-Hour Operation|متاح على مدار الساعة
24-Hour Schedule ·|جدول 24 ساعة ·
3 Hours|3 ساعات
3. Initial Pitch & Standard Rate|3. الملعب الأول والسعر الأساسي
30% Online + 70% Venue Cash|30٪ عبر الإنترنت + 70٪ نقداً في الملعب
4 Hours (Platform Standard)|4 ساعات (الحد الأساسي)
5-a-side|5 لاعبين لكل فريق
500 EGP / hr|500 ج.م / ساعة
6-month expiry policy|تنتهي المخالفات بعد 6 أشهر
7-a-side|7 لاعبين لكل فريق
A 10-minute hold starts after reservation|تبدأ مهلة دفع مدتها 10 دقائق بعد الحجز
A court requires between 2 and 6 photos.|يجب إضافة صورتين إلى 6 صور للملعب.
ACCOUNT SETTINGS & INBOX|إعدادات الحساب والإشعارات
ADMIN CONTROL|لوحة الإدارة
Account Created|تم إنشاء الحساب
Account Email|بريد الحساب الإلكتروني
Account Suspended (4 Strikes)|الحساب موقوف عن الحجز (4 مخالفات)
Acrylic / Hardcourt|أكريليك / أرضية صلبة
Action Failed|تعذر تنفيذ الإجراء
Action Required (|إجراءات مطلوبة (
Actions|الإجراءات
Activate|تفعيل
Activating your account…|جارٍ تفعيل حسابك…
Active|نشط
Active Pitches|الملاعب النشطة
Active Strikes: {{value0}} of 4|المخالفات السارية: {{value0}} من 4
Active filters:|عوامل التصفية:
Add 5v5/7v7/11v11 pitches or padel courts, set daytime and evening hourly rates, and adjust hours.|أضف ملاعب خماسية أو سباعية أو 11 لاعباً أو ملاعب بادل، وحدد الأسعار النهارية والمسائية وساعات العمل.
Add New Court / Pitch|إضافة ملعب جديد
Add Pitch|إضافة ملعب
Add Walk-In / Phone Booking|إضافة حجز مباشر أو هاتفي
Add Walk-In Reservation|إضافة حجز مباشر
Address|العنوان
Admin Actions|إجراءات الإدارة
Advanced (5.0+)|متقدم (5.0+)
Africa/Cairo (EET/EEST)|توقيت القاهرة (الشتوي / الصيفي)
Africa/Cairo Time|بتوقيت القاهرة
Africa/Cairo timezone|المنطقة الزمنية: القاهرة
Africa/Cairo • Live|القاهرة • مباشر
Alert Channels|قنوات الإشعارات
Alerts when match check-in or no-show is recorded|إشعارات تسجيل الحضور أو الإبلاغ عن عدم الحضور
All (24h)|الكل (24 ساعة)
All areas|جميع المناطق
All sports|جميع الرياضات
All Bookings|كل الحجوزات
All Bookings (|كل الحجوزات (
All court bookings|جميع حجوزات الملاعب
All court submissions have been reviewed.|تمت مراجعة جميع طلبات الملاعب.
All financial flows reconciled cleanly.|تمت مطابقة جميع العمليات المالية.
All operational queues are clear. Zero pending approvals or unresolved disputes.|لا توجد موافقات معلقة أو نزاعات لم تُحل.
All payments settled online|تم سداد المبلغ بالكامل عبر الإنترنت
All queues nominal|كل قوائم المتابعة منتظمة
All sports|كل الرياضات
Already have an account?|لديك حساب بالفعل؟
Amount|المبلغ
Amount Due Now|المبلغ المطلوب الآن
Any size|كل الأحجام
Appeal Error|تعذر إرسال الاستئناف
Appeal Filed|تم إرسال الاستئناف
Appeal Message|رسالة الاستئناف
Appeal Processed|تمت معالجة الاستئناف
Appeal Suspension|استئناف إيقاف الحجز
Approval Error|تعذرت الموافقة
Approval Failed|تعذرت الموافقة
Approve Owner|اعتماد المالك
Approve Owner Request|الموافقة على طلب المالك
Approve owner accounts to grant them permission to enter and submit venue information.|اعتمد حسابات الملاك للسماح لهم بإضافة بيانات منشآتهم وإرسالها.
Approved|معتمد
Approved & Public|معتمد ومتاح للجمهور
Approving…|جارٍ الاعتماد…
Artificial Turf|نجيل صناعي
At least 8 characters|8 أحرف على الأقل
Attempts|المحاولات
Audit log|سجل العمليات
Authoritative Booking Code|رمز الحجز المعتمد
Authoritative address and contact information.|العنوان وبيانات التواصل المعتمدة.
Available|متاح
Available Balance|الرصيد المتاح
Available Capacity|السعة المتاحة
Available slots|مواعيد الملعب
Awaiting Super Admin Approval|بانتظار موافقة الإدارة
BOOKING CONFIRMED|تم تأكيد الحجز
Back to Home|العودة للرئيسية
Back to courts|العودة للملاعب
Back to sign in|العودة لتسجيل الدخول
Ball-playing Defender|مدافع يجيد بناء اللعب
Batched Payouts|دفعات التحويل
Beginner (1.0 - 2.5)|مبتدئ (1.0 - 2.5)
Billing Period|فترة التسوية
Billing Window|فترة التسوية
Block Court (Maintenance)|إغلاق فترة للصيانة
Block Court Slot|إغلاق موعد بالملعب
Block Failed|تعذر إغلاق الفترة
Blocked|محظور من الحجز
Blocked Player Appeals (|استئنافات اللاعبين الموقوفين (
Book|احجز
Book New Match|احجز مباراة جديدة
Booked|محجوز
Booked Hours|الساعات المحجوزة
Booking|الحجز
Booking & Code|الحجز والرمز
Booking Cancelled|تم إلغاء الحجز
Booking Code|رمز الحجز
Booking Confirmations|تأكيدات الحجز
Booking Error|خطأ في الحجز
Booking Failed|تعذر الحجز
Booking cancelled. 100% full refund issued.|تم إلغاء الحجز واسترداد المبلغ بالكامل.
Booking error|خطأ في الحجز
Booking:|الحجز:
Bookings|الحجوزات
Bookings could not be loaded.|تعذر تحميل الحجوزات.
Bookings pages|صفحات الحجوزات
Both / Ambidextrous|كلتا القدمين
Box-to-box Engine|لاعب وسط شامل
Cairo|القاهرة
Cairo Operations Center|مركز عمليات القاهرة
Cairo, Egypt|القاهرة، مصر
Calculating refund preview…|جارٍ حساب مبلغ الاسترداد…
Calculating…|جارٍ الحساب…
Calendar|الجدول
Calendar date picker|اختيار التاريخ
Cancel|إلغاء
Cancel Booking|إلغاء الحجز
Cancel Failed|تعذر الإلغاء
Cancel Reservation|إلغاء الحجز
Cancel and return|إلغاء والعودة
Cancellation Error|تعذر إلغاء الحجز
Cancellation policy:|سياسة الإلغاء:
Cancellations & Refunds|الإلغاءات والاستردادات
Cancelled|ملغي
Cancelling…|جارٍ الإلغاء…
Cash Due at Venue|المطلوب نقداً في الملعب
Cash payment collected at venue.|تم تحصيل المبلغ نقداً في الملعب.
Changes Saved|تم حفظ التغييرات
Changes saved!|تم حفظ التغييرات!
Channel preference saved.|تم حفظ تفضيل قناة الإشعارات.
Check Balance|عرض الرصيد
Check in arriving captains, collect cash due, report no-shows, and record walk-in games.|سجّل حضور اللاعبين وحصّل المبالغ النقدية وأبلغ عن الغياب وأضف الحجوزات المباشرة.
Check your inbox.|راجع بريدك الإلكتروني.
Check your network connection and try again.|تحقق من اتصالك بالإنترنت وحاول مجدداً.
Check-In Failed|تعذر تسجيل الحضور
Checked In|تم تسجيل الحضور
Checking approval status...|جارٍ التحقق من حالة الموافقة…
Choose consecutive hours|اختر ساعات متتالية
Choose how you would like to be notified for each match-day category.|حدد طريقة تلقي الإشعارات لكل فئة من أحداث المباراة.
Choose payment method:|اختر طريقة الدفع:
Clear all filters|مسح كل عوامل التصفية
Click to choose photos from your device / phone|اضغط لاختيار الصور من جهازك أو هاتفك
Close|إغلاق
Close court slots for turf maintenance, lighting repair, or weather. This prevents players from booking during this window.|أغلق مواعيد الملعب لصيانة النجيل أو الإضاءة أو بسبب الطقس لمنع الحجز خلالها.
Close notification|إغلاق الإشعار
Close reservation details|إغلاق تفاصيل الحجز
Collect 70% from players|تحصيل 70٪ من اللاعبين
Collect Cash|تحصيل المبلغ النقدي
Collection Failed|تعذر التحصيل
Comments (turf condition, lighting, amenities)|تعليقك (النجيل والإضاءة والخدمات)
Commission|العمولة
Commission Error|خطأ في العمولة
Commission Rate|نسبة العمولة
Commission Saved|تم حفظ العمولة
Commission must be between 10% and 20% (1000 to 2000 basis points).|يجب أن تكون العمولة بين 10٪ و20٪ (1000 إلى 2000 نقطة أساس).
Complete payment|إتمام الدفع
Completed|مكتمل
Completion Failed|تعذر إكمال المباراة
Configure your first bookable pitch. Standard 24h round-the-clock availability is set.|أضف ملعبك الأول. تم ضبط الجدول على مدار 24 ساعة.
Configured|تم الإعداد
Confirm & Lock In Slot (|تأكيد وحجز الموعد (
Confirm Cancellation|تأكيد الإلغاء
Confirm Walk-In Booking|تأكيد الحجز المباشر
Confirmed|مؤكد
Confirmed Bookings|الحجوزات المؤكدة
Confirmed Only|المؤكدة فقط
Confirming match reservation…|جارٍ تأكيد حجز المباراة…
Confirming reservation…|جارٍ تأكيد الحجز…
Contact Phone|رقم التواصل
Contact Phone *|رقم التواصل *
Contact Phone / WhatsApp *|رقم الهاتف / واتساب *
Continue to Checkout|متابعة إتمام الحجز
Continue to Checkout (|متابعة إتمام الحجز (
Could not load bookings|تعذر تحميل الحجوزات
Could not process photo selection.|تعذرت معالجة الصور المحددة.
Court|الملعب
Court Approved|تم اعتماد الملعب
Court Creation Failed|تعذرت إضافة الملعب
Court Environment|بيئة الملعب
Court Photos Required|صور الملعب مطلوبة
Court Rejected|تم رفض الملعب
Court Schedule|جدول الملاعب
Court Slot Blocked|تم إغلاق الفترة
Court Submitted for Approval|تم إرسال الملعب للمراجعة
Court Type|نوع الملعب
Court block|فترة مغلقة
Court photo {{value0}}|صورة الملعب {{value0}}
Court slot blocked successfully.|تم إغلاق فترة الملعب بنجاح.
Courts|الملاعب
Courts are available. Add walk-in games or share venue link with players.|الملاعب متاحة. أضف حجزاً مباشراً أو شارك رابط المنشأة مع اللاعبين.
Courts as columns, hours as rows. View booked match slots and block maintenance windows.|الملاعب في الأعمدة والساعات في الصفوف. تابع الحجوزات وأغلق فترات الصيانة.
Courts in Cairo|ملاعب القاهرة
Covered Indoor|مغطى وداخلي
Create account|إنشاء حساب
Create account →|إنشاء حساب ←
Create your account.|أنشئ حسابك.
Creating account…|جارٍ إنشاء الحساب…
Currency:|العملة:
Currently|حالياً
Custom Avatar Saved|تم حفظ الصورة الشخصية
Customer Name|اسم العميل
Customer Phone (Optional)|هاتف العميل (اختياري)
Customer Support & On-Call Admin|دعم العملاء والإدارة المناوبة
Danger Zone|منطقة الخطر
Delete Account|حذف الحساب
Delete My Account|حذف حسابي
Permanently Delete Account|حذف الحساب نهائياً
Are you sure you want to delete your account? This action cannot be undone. Any completed reservations will be anonymized, and active sessions will be terminated.|هل أنت متأكد من رغبتك في حذف حسابك؟ لا يمكن التراجع عن هذا الإجراء. ستتم إزالة بياناتك الشخصية من الحجوزات السابقة وإنهاء جميع الجلسات.
Your account has been deleted permanently.|تم حذف حسابك نهائياً.
Once you delete your account, your personal information is permanently redacted and your access is revoked. This action cannot be undone.|بمجرد حذف حسابك، سيتم حذف معلوماتك الشخصية نهائياً وإلغاء إمكانية وصولك. لا يمكن التراجع عن هذا الإجراء.
Deleting...|جارٍ الحذف...
Area|المنطقة
Filter by area|تصفية حسب المنطقة
Dark mode|الوضع الداكن
Date & Kickoff|التاريخ وموعد البداية
Datetime calendar picker|اختيار التاريخ والوقت
Decided|تم اتخاذ القرار
Decision|القرار
Default Avatar|الصورة الافتراضية
Deposit (30%)|العربون (30٪)
Describe your court surfaces, lighting, parking, changing rooms...|صف أرضية الملعب والإضاءة وموقف السيارات وغرف تغيير الملابس…
Description & Amenities|الوصف والخدمات
Direct contact:|التواصل المباشر:
Disbursed|تم التحويل
Discover|اكتشف الملاعب
Discover Courts|اكتشف الملاعب
Dispute Error|تعذر تقديم الاعتراض
Dispute No-Show|اعتراض على عدم الحضور
Dispute No-Show (48h)|اعتراض على الغياب (48 ساعة)
Dispute Resolved|تم حل النزاع
Dispute Submitted|تم تقديم الاعتراض
Dispute escalation and refund inquiries|تصعيد النزاعات واستفسارات الاسترداد
Disputes|النزاعات
Disputes & Appeals|النزاعات والاستئنافات
Disputes & Claims|النزاعات والمطالبات
Disputes & Strike Appeals Arbitration|الفصل في النزاعات واستئنافات المخالفات
Disputes & Strikes|النزاعات والمخالفات
Disputes (|النزاعات (
District / Area *|الحي / المنطقة *
Done|تم
Double Glass Padel|بادل زوجي زجاجي
Draft|مسودة
Due At Court|المطلوب في الملعب
Due at Venue|المطلوب في الملعب
Due at court|المطلوب في الملعب
Duration|المدة
Duration (Hours)|المدة (بالساعات)
EGP|ج.م
EGP Due|ج.م مستحقة
EGP in payout queue|ج.م بانتظار التحويل
EGP online, pay remainder at court in cash|ج.م عبر الإنترنت، والباقي نقداً في الملعب
EGP) →|ج.م) ←
EN|EN
Edit Commission|تعديل العمولة
Edit Venue Details|تعديل بيانات المنشأة
Egyptian Pounds (EGP / ج.م)|الجنيه المصري (ج.م)
Egyptian phone number (Optional)|رقم الهاتف المصري (اختياري)
Email|البريد الإلكتروني
Email Notifications|إشعارات البريد الإلكتروني
Email Support Desk|راسل فريق الدعم
Email address|البريد الإلكتروني
English |English 
Environment|البيئة
Error|خطأ
Error Diagnostic|تفاصيل الخطأ
Explain why your strikes should be cleared...|وضح أسباب طلب إلغاء المخالفات…
Explore nearby courts|اكتشف الملاعب القريبة
Explore venues|اكتشف الملاعب
FAKEGATEWAY LOCAL CHECKOUT|دفع تجريبي محلي
Failed to read image file.|تعذرت قراءة الصورة.
Failed to read image files.|تعذرت قراءة الصور.
Finances|المعاملات المالية
Finances & Payouts|الأرصدة والتحويلات
Financial overview unavailable.|تعذر تحميل الملخص المالي.
Find courts|ابحث عن ملعب
Find the court that feels like|الملعب المناسب ليك… العب وكأنك في
Finding…|جارٍ البحث…
Finished|منتهية
Fixed 60 Minutes (on the hour)|60 دقيقة ثابتة (تبدأ على رأس الساعة)
Fixed 60-minute match slots in 24 hours schedule. Players can book up to 4 consecutive slots.|مواعيد مدتها 60 دقيقة على مدار اليوم، ويمكن حجز 4 ساعات متتالية بحد أقصى.
Football|كرة القدم
Football Pitch Size|حجم ملعب كرة القدم
Football and padel venues across Cairo, real-time availability, and instant 10-minute hold booking with 30% online deposit or full checkout.|ملاعب كرة قدم وبادل في القاهرة، ومواعيد محدثة لحظياً وحجز فوري بمهلة دفع 10 دقائق. ادفع عربون 30٪ أو المبلغ بالكامل.
Football �|كرة القدم ⚽
Free cancellation with 100% refund up to 24 hours before kickoff. Within 24 hours, the deposit is forfeited.|إلغاء مجاني واسترداد كامل قبل البداية بـ24 ساعة على الأقل. عند الإلغاء خلال آخر 24 ساعة يُحتجز العربون.
Full Street Address *|العنوان التفصيلي *
Full amount settled online. Walk in and play with zero cash.|تم سداد المبلغ بالكامل عبر الإنترنت. احضر والعب دون دفع نقدي.
Full name|الاسم الكامل
Fully Settled|مسدد بالكامل
GAME|مباراة ممتعة
GOOD|دايماً
Game on!|المباراة جاهزة!
Generate Batch|إنشاء دفعة تحويل
Generate Venue Payout Batch|إنشاء دفعة تحويل للمنشأة
Goalkeeper|حارس مرمى
Have questions about a match, no-show dispute, or payment issue? Our team is available 24/7.|لديك سؤال عن مباراة أو اعتراض على الغياب أو مشكلة في الدفع؟ فريقنا متاح على مدار الساعة.
Healthy slot utilization|معدل إشغال جيد
Held until kickoff / match verification|محتجز حتى موعد المباراة / التحقق منها
Hold expires in|تنتهي مهلة الدفع خلال
Hourly Price (EGP) *|سعر الساعة (ج.م) *
Hourly Rate (EGP) *|سعر الساعة (ج.م) *
Hourly rate updated. Activates in 24 hours per platform rules.|تم تعديل سعر الساعة. يُفعّل بعد 24 ساعة وفق سياسة المنصة.
Hours per Match|ساعات المباراة
How was the pitch at|كيف كانت تجربتك في ملعب
I am joining as:|أنضم بصفتي:
In-App / Push Alerts|إشعارات التطبيق والهاتف
Inbox Updated|تم تحديث الإشعارات
Inbox is quiet.|لا توجد إشعارات جديدة.
Indoor|داخلي
Instant Hold:|مهلة الدفع:
Instant alerts when slots are held and paid|تنبيهات فورية عند حجز الموعد وإتمام الدفع
Instant replies for match-day emergencies|رد سريع لحالات الطوارئ يوم المباراة
Interactive Schedule|جدول تفاعلي
Interface Language:|لغة الواجهة:
Intermediate (3.0 - 4.5)|متوسط (3.0 - 4.5)
Invalid Photo Count|عدد الصور غير صالح
Invalid Rate|سعر غير صالح
Item ID|معرف العنصر
JOIN MAL3BNA|انضم إلى ملعبنا
JPG, PNG, WEBP (Min 2, Max 6 photos)|JPG، PNG، WEBP (من صورتين إلى 6 صور)
KICKOFF|بداية المباراة
Keep Booking|الاحتفاظ بالحجز
Kickoff|البداية
Kickoff (Cairo)|البداية (بتوقيت القاهرة)
Kickoff Slot|موعد المباراة
Kickoff Time|وقت البداية
Language|اللغة
Language & Region|اللغة والمنطقة
Language / اللغة|اللغة
Leave a Review|أضف تقييمك
Left|اليسرى
Light mode|الوضع الفاتح
Limit Reached|تم الوصول للحد الأقصى
Live reservations for kickoff check-in and cash collection at your venue gate.|حجوزات محدثة لتسجيل الحضور وتحصيل المبالغ النقدية عند الوصول.
Loading all court bookings…|جارٍ تحميل جميع حجوزات الملاعب…
Loading disputes and appeals…|جارٍ تحميل النزاعات والاستئنافات…
Loading financial ledger…|جارٍ تحميل السجل المالي…
Loading match-day operations…|جارٍ تحميل عمليات يوم المباراة…
Loading notifications…|جارٍ تحميل الإشعارات…
Loading payouts & ledger…|جارٍ تحميل التحويلات والسجل المالي…
Loading profile…|جارٍ تحميل الملف الشخصي…
Loading reconciliation items…|جارٍ تحميل عناصر المطابقة…
Loading schedule…|جارٍ تحميل الجدول…
Loading super admin dashboard…|جارٍ تحميل لوحة الإدارة…
Loading users…|جارٍ تحميل المستخدمين…
Loading venue dashboard…|جارٍ تحميل لوحة المنشأة…
Loading venue details…|جارٍ تحميل بيانات المنشأة…
Loading venue management queue…|جارٍ تحميل طلبات المنشآت…
Loading venue setup…|جارٍ تحميل إعدادات المنشأة…
Loading your session…|جارٍ تحميل جلستك…
Loading your workspace…|جارٍ تحميل لوحة التحكم…
Lock in your pitch.|احجز ملعبك.
MATCH SCHEDULE|جدول المباريات
MLB-BOOKING|MLB-BOOKING
Maadi Technology Park, Building 4, Cairo|القرية التكنولوجية بالمعادي، مبنى 4، القاهرة
Main Pitch|الملعب الرئيسي
Mal3bna Venue|منشأة ملعبنا
Manage Arrivals|إدارة الحضور
Manage Photos (Min 2, Max 6)|إدارة الصور (من صورتين إلى 6 صور)
Management Modules|أقسام الإدارة
Manual Booking Created|تم إنشاء الحجز المباشر
Manual reservations directly reserve pitch slots on your calendar without online deposit requirements.|الحجز المباشر يغلق الموعد في جدولك دون اشتراط عربون إلكتروني.
Mark Paid|تأكيد التحويل
Mark read|تحديد كمقروء
Marketplace Control Center|مركز إدارة المنصة
Match Actions|إجراءات المباراة
Match Completed|اكتملت المباراة
Match Day|يوم المباراة
Match Day Bookings|حجوزات يوم المباراة
Match Day Check-in|تسجيل حضور المباريات
Match Details|تفاصيل المباراة
Match Reminders|تذكيرات المباريات
Match completed and verified.|اكتملت المباراة وتم تأكيدها.
Match confirmed! Reservation saved to ledger.|تم تأكيد المباراة وتسجيل الحجز.
Match starts in less than 24 hours. The 30% deposit is non-refundable upon cancellation.|تبدأ المباراة خلال أقل من 24 ساعة. لا يُسترد عربون 30٪ عند الإلغاء.
Match-Day Arrivals|حضور مباريات اليوم
Match-day Status & Disputes|حالة المباراة والنزاعات
Max 4 consecutive hours|4 ساعات متتالية كحد أقصى
Max Consecutive|الحد الأقصى المتتالي
Max Consecutive Hours per Match (Platform Max: 4)|الساعات المتتالية للمباراة (حد المنصة: 4)
Max Hours per Booking (Max 4)|الحد الأقصى لساعات الحجز (4)
Max booking:|أقصى مدة حجز:
Maximum 6 photos allowed.|الحد الأقصى 6 صور.
Missing Court|الملعب غير محدد
Missing Fields|بيانات ناقصة
Missing Information|بيانات ناقصة
Missing court or time slot selection.|اختر الملعب والموعد أولاً.
Money|الأرصدة
My Bookings|حجوزاتي
NEW|جديد
Name|الاسم
Name, address, and phone are required.|الاسم والعنوان ورقم الهاتف مطلوبة.
Natural Grass|نجيل طبيعي
Need an account?|ليس لديك حساب؟
Needs retry|يتطلب إعادة المحاولة
New pitches created by venue owners will appear here for mandatory verification before going public.|تظهر الملاعب الجديدة هنا للمراجعة الإلزامية قبل إتاحتها للجمهور.
Next Month|الشهر التالي
Next bookings page|صفحة الحجوزات التالية
No bookings found in this view.|لا توجد حجوزات في هذا القسم.
No bookings registered yet.|لا توجد حجوزات مسجلة بعد.
No court bookings yet.|لا توجد حجوزات ملاعب بعد.
No courts found matching criteria.|لا توجد ملاعب تطابق بحثك.
No disputes reported.|لا توجد نزاعات مسجلة.
No failed refunds, orphaned holds, or dead-letter queue records detected.|لا توجد استردادات فاشلة أو حجوزات معلقة بلا معالجة أو مهام متعذرة.
No match slots in this time window|لا توجد مواعيد ضمن هذه الفترة
No matches scheduled for today|لا توجد مباريات اليوم
No open disputes.|لا توجد نزاعات مفتوحة.
No payout batches created yet.|لم تُنشأ دفعات تحويل بعد.
No payouts generated yet.|لم تُنشأ تحويلات بعد.
No pending appeals.|لا توجد استئنافات معلقة.
No photos uploaded|لم تُرفع صور
No photos uploaded yet. Select at least 2 photos from your device.|لم تُرفع صور بعد. اختر صورتين على الأقل من جهازك.
No photos uploaded yet. Tap "Manage Photos" to upload 2 to 6 photos.|لم تُرفع صور بعد. اضغط «إدارة الصور» لرفع صورتين إلى 6 صور.
No pitch photos uploaded yet. Select at least 2 photos from your device.|لم تُرفع صور للملعب بعد. اختر صورتين على الأقل من جهازك.
No users found.|لا يوجد مستخدمون.
No venue photos uploaded yet. Please select at least 2 photos.|لم تُرفع صور للمنشأة بعد. اختر صورتين على الأقل.
No venues registered yet.|لا توجد منشآت مسجلة بعد.
No-Show|عدم الحضور
No-Show Pending|بلاغ غياب قيد المراجعة
No-Show Reported|تم الإبلاغ عن عدم الحضور
No-Show Strike|مخالفة عدم الحضور
No-show reported. Player has 48h dispute deadline.|تم الإبلاغ عن عدم الحضور. أمام اللاعب 48 ساعة للاعتراض.
Notification Preferences|تفضيلات الإشعارات
Notification marked as read.|تم تحديد الإشعار كمقروء.
Notifications|الإشعارات
ONE LAST STEP|خطوة أخيرة
OWNER SPACE|لوحة المالك
OWNER SPACE • FINANCIAL LEDGER & PAYOUTS|لوحة المالك • السجل المالي والتحويلات
OWNER SPACE • MATCH DAY OPERATIONS|لوحة المالك • عمليات يوم المباراة
OWNER SPACE • MATCH-DAY SCHEDULE|لوحة المالك • جدول المباريات
OWNER SPACE • VENUE CONFIGURATION|لوحة المالك • إعدادات المنشأة
Online deposit|عربون إلكتروني
Open|مفتوح
Open Disputes|النزاعات المفتوحة
Open Schedule|فتح الجدول
Open the link in your email to activate your account.|افتح الرابط في بريدك الإلكتروني لتفعيل حسابك.
Operating hours: 09:00 - 23:00 daily|ساعات العمل: يومياً من 09:00 إلى 23:00
Operations & Management|العمليات والإدارة
Outdoor|خارجي
Outdoor Pitch|ملعب خارجي
Overall Court Utilization|إجمالي إشغال الملاعب
Oversee venue licensing, arbitrate player disputes, manage commission policy, and authorize batched financial settlements.|راجع اعتماد المنشآت وافصل في نزاعات اللاعبين وأدر سياسة العمولة واعتمد دفعات التسوية المالية.
Overturned|تم إلغاء المخالفة
Overview|نظرة عامة
Owner Account|حساب مالك
Owner Account Approved|تم اعتماد حساب المالك
Owner Approved|تم اعتماد المالك
Owner Request Under Review|طلب المالك قيد المراجعة
Owner Requests (|طلبات الملاك (
Owner:|المالك:
PAID ONLINE|مدفوع إلكترونياً
PLAYER REVIEWS|تقييمات اللاعبين
PLAYER • PROFILE & TRUST|اللاعب • الملف الشخصي وسجل الالتزام
Padel|بادل
Padel Skill Level|مستوى البادل
Page|الصفحة
per page|لكل صفحة
Paid|مدفوع
Paid / total|المدفوع / الإجمالي
Paid 100%|مدفوع بالكامل
Partner|شريك
Password|كلمة المرور
Past|انتهى الموعد
Pay|ادفع
Pay 100% Online|ادفع المبلغ بالكامل إلكترونياً
Pay 100% online|ادفع المبلغ بالكامل إلكترونياً
Pay 30% Deposit Now|ادفع عربون 30٪ الآن
Pay 30% deposit|ادفع عربون 30٪
Pay at venue|ادفع في الملعب
Payment Collected|تم تحصيل المبلغ
Payment Hold|مهلة دفع
Payment Reference|مرجع الدفع
Payment Terms:|شروط الدفع:
Payment confirmed|تم تأكيد الدفع
Payment failed|تعذر الدفع
Payment pending|الدفع قيد الانتظار
Payout Batch Created|تم إنشاء دفعة التحويل
Payout Batches & History|دفعات التحويل والسجل
Payout Error|خطأ في التحويل
Payout ID|معرف التحويل
Payout Reference|مرجع التحويل
Payout Requests|طلبات التحويل
Payout Updated|تم تحديث التحويل
Payout batch generated from released ledger balance.|تم إنشاء دفعة التحويل من الرصيد المُتاح في السجل المالي.
Payouts|التحويلات
Payouts & Ledger|التحويلات والسجل المالي
Pending|قيد الانتظار
Pending Approval|بانتظار الموافقة
Pending Release|بانتظار إتاحة الرصيد
Pending Venue Owner Requests|طلبات ملاك المنشآت المعلقة
Pending transfer|بانتظار التحويل
Period End|نهاية الفترة
Period Start|بداية الفترة
Phone|الهاتف
Photo|صورة
Photo Saved|تم حفظ الصورة
Photo {{value0}}|الصورة {{value0}}
Photos|الصور
Photos Added|تمت إضافة الصور
Photos Required|الصور مطلوبة
Photos Saved|تم حفظ الصور
Pick Date (Up to 30 Days Ahead)|اختر التاريخ (حتى 30 يوماً مقدماً)
Pick your court|اختر ملعبك
Pitch|الملعب
Pitch & Customer|الملعب والعميل
Pitch Name|اسم الملعب
Pitch Occupancy|إشغال الملاعب
Pitch Occupancy Rate|نسبة إشغال الملاعب
Pitch Photos|صور الملعب
Pitch Photos (Min 2, Max 6) *|صور الملعب (من صورتين إلى 6 صور) *
Pitch Portfolio (|قائمة الملاعب (
Pitch added and submitted for Super Admin review. It will become bookable once approved.|تمت إضافة الملعب وإرساله لمراجعة الإدارة. سيُتاح للحجز بعد الموافقة.
Pitches|الملاعب
Platform Standards|معايير المنصة
Platform operations|عمليات المنصة
Platform payouts are batch-generated by admin and sent directly via bank transfer or InstaPay.|تُنشئ الإدارة دفعات التحويل وتُرسلها مباشرة عبر تحويل بنكي أو إنستاباي.
Platform requirement: upload between 2 and 6 photos showing your pitch, surface, and amenities.|ارفع صورتين إلى 6 صور توضح الملعب وأرضيته والخدمات المتاحة.
Platform rules require minimum 2 and maximum 6 verified photos.|تتطلب المنصة من صورتين إلى 6 صور معتمدة.
Player|لاعب
Player / customer|اللاعب / العميل
Player Account Required|يلزم حساب لاعب
Player Avatar|الصورة الشخصية للاعب
Player Captain|كابتن الفريق
Player Checked In|تم تسجيل حضور اللاعب
Player Explanation|توضيح اللاعب
Player No-Show Disputes (|اعتراضات اللاعبين على الغياب (
Player Profile|الملف الشخصي للاعب
Player arrived and checked in for kickoff.|وصل اللاعب وتم تسجيل حضوره للمباراة.
Player, walk-in, and court-block reservations across every venue.|حجوزات اللاعبين والحجوزات المباشرة والفترات المغلقة في جميع المنشآت.
Playing Style|أسلوب اللعب
Playmaker|صانع ألعاب
Please fill in all required venue details.|أكمل جميع بيانات المنشأة المطلوبة.
Please select a court|اختر ملعباً
Please select a venue for the payout cycle.|اختر المنشأة لدورة التحويل.
Please sign in or create an account to record your reservation and access match code.|سجّل الدخول أو أنشئ حساباً لتسجيل الحجز والحصول على رمز المباراة.
Please sign in with your player account to complete your booking.|سجّل الدخول بحساب لاعب لإكمال حجزك.
Poacher / Striker|مهاجم / قناص
Preferences Updated|تم تحديث التفضيلات
Preferences saved successfully.|تم حفظ التفضيلات بنجاح.
Preferred Foot|القدم المفضلة
Premier sports destination with certified high-grade turf, floodlights, and player amenities.|وجهة رياضية بنجيل عالي الجودة وإضاءة وخدمات للاعبين.
Previous Month|الشهر السابق
Previous bookings page|صفحة الحجوزات السابقة
Price unavailable. Please return to the venue and retry.|السعر غير متاح. عد إلى صفحة المنشأة وحاول مجدداً.
Pricing Error|خطأ في التسعير
Pricing Saved|تم حفظ الأسعار
Primary Football Position|مركزك الأساسي في كرة القدم
Profile|الملف الشخصي
Profile Updated|تم تحديث الملف الشخصي
Rating|التقييم
Reactivate|إعادة التفعيل
Ready for a match?|جاهز لمباراة؟
Ready for payout cycle|جاهز لدورة التحويل
Ready to play?|جاهز للعب؟
Real-time updates regarding bookings and payments|تحديثات لحظية للحجوزات والمدفوعات
Reason for Block|سبب الإغلاق
Ref:|المرجع:
Refresh|تحديث
Refresh Approval Status|تحديث حالة الموافقة
Refresh Queue|تحديث القائمة
Refresh Status|تحديث الحالة
Refund Amount:|مبلغ الاسترداد:
Regional & Localization|اللغة والإعدادات الإقليمية
Register|إنشاء حساب
Register (10s)|إنشاء حساب (10 ثوانٍ)
Registered Venues (|المنشآت المسجلة (
Registration Error|تعذر إنشاء الحساب
Reject|رفض
Rejected|مرفوض
Released Balance|الرصيد المتاح للتحويل
Remove pitch size filter|إزالة تصفية حجم الملعب
Remove search filter|إزالة تصفية البحث
Remove sport filter|إزالة تصفية الرياضة
Report Failed|تعذر إرسال البلاغ
Requested:|تاريخ الطلب:
Resend verification email|إعادة إرسال رسالة التفعيل
Reservation|الحجز
Reservation Created|تم إنشاء الحجز
Reservation Details|تفاصيل الحجز
Reserve and continue to payment|احجز وانتقل للدفع
Reserved|محجوز
Reset all|إعادة تعيين الكل
Resolved|تم الحل
Return to court availability|العودة لمواعيد الملعب
Review Error|تعذر إرسال التقييم
Review Published|تم نشر التقييم
Review Queues|قوائم المراجعة
Review online deposit releases, commission deductions, and track bank payout schedules.|راجع إتاحة العربون وخصم العمولة وتابع مواعيد التحويلات البنكية.
Review your Match|قيّم تجربتك
Right|اليمنى
Role|الدور
Round-the-clock 24-hour slots provisioned. Super Admin will verify your photos and listing.|تم إعداد مواعيد على مدار الساعة. ستراجع الإدارة الصور وبيانات الملعب.
Rule: Price changes activate after 24h per platform rules.|تُفعّل تغييرات الأسعار بعد 24 ساعة وفق سياسة المنصة.
SUPER ADMIN CONSOLE|لوحة الإدارة العامة
Save|حفظ
Save Commission|حفظ العمولة
Save Error|تعذر الحفظ
Save Pitch|حفظ الملعب
Save Profile Preferences|حفظ تفضيلات الملف الشخصي
Save Venue Details|حفظ بيانات المنشأة
Save {{value0}} Photos|حفظ {{value0}} صور
Saving Photos…|جارٍ حفظ الصور…
Saving…|جارٍ الحفظ…
Schedule|الجدول
Schedule time window|الفترة الزمنية للجدول
Schedule unavailable.|تعذر تحميل الجدول.
Search venues or areas|ابحث عن ملعب أو منطقة
Search venues, clubs, or Cairo areas…|ابحث عن ملاعب أو أندية أو مناطق القاهرة…
Search: "|البحث: «
Securing your spot with the venue and freezing the rate breakdown.|جارٍ حجز موعدك وتثبيت تفاصيل السعر.
Select Available Pitch|اختر ملعباً متاحاً
Select Cairo Area…|اختر منطقة في القاهرة…
Select Court|اختر الملعب
Select Venue|اختر المنشأة
Select image files (JPG, PNG, WEBP) • Min 2, Max 6 photos|اختر الصور (JPG، PNG، WEBP) • من صورتين إلى 6 صور
Select images (JPG, PNG, WEBP) • Min 2, Max 6 photos|اختر الصور (JPG، PNG، WEBP) • من صورتين إلى 6 صور
Selected time|الوقت المحدد
Send Venue Info|إرسال بيانات المنشأة
Send Venue Info & Photos for Super Admin Approval|إرسال بيانات المنشأة والصور لموافقة الإدارة
Send Venue Information|إرسال بيانات المنشأة
Set Hourly Rate (EGP)|حدد سعر الساعة (ج.م)
Set Rate|تحديد السعر
Settings|الإعدادات
Settled Volume|إجمالي التسويات
Gross Volume|إجمالي القيمة
Across all bookings|عبر جميع الحجوزات
Settlement & Money|التسويات والأرصدة
Setup Checklist|قائمة الإعداد
Short-notice kickoff:|المباراة تبدأ قريباً:
Show up and kickoff|احضر وابدأ اللعب
Sign In|تسجيل الدخول
Sign In & Lock In Slot (|سجّل الدخول واحجز الموعد (
Sign In Error|تعذر تسجيل الدخول
Sign In Required|يلزم تسجيل الدخول
Sign Out|تسجيل الخروج
Sign in to mal3bna|تسجيل الدخول إلى ملعبنا
Sign in →|تسجيل الدخول ←
Sign out|تسجيل الخروج
Signed In|تم تسجيل الدخول
Signed Out|تم تسجيل الخروج
Signed in as Venue Owner|مسجل الدخول كمالك منشأة
Signing in…|جارٍ تسجيل الدخول…
Simulate Failure|تجربة فشل الدفع
Simulate Pending|تجربة الدفع المعلق
Size|الحجم
Slot|الموعد
Slot Duration:|مدة الموعد:
Slot hold expired.|انتهت مهلة دفع الحجز.
Sport|الرياضة
Sports Profile & Play Style|الملف الرياضي وأسلوب اللعب
Standard Double (Glass)|زوجي قياسي (زجاجي)
Standard Double Padel (Glass)|بادل زوجي قياسي (زجاجي)
Standard Rate|السعر الأساسي
Start Time|وقت البداية
Status|الحالة
Status Check|التحقق من الحالة
Status Error|خطأ في الحالة
Strikes are issued for unexcused no-shows. 4 active strikes block court bookings. Past match data and appeals remain fully accessible.|تُسجّل مخالفات عند عدم الحضور دون عذر. تمنع 4 مخالفات سارية إنشاء حجوزات جديدة، مع استمرار الوصول لسجل المباريات والاستئنافات.
Submission Error|تعذر الإرسال
Submit Appeal to Admin|إرسال الاستئناف للإدارة
Submit Dispute to Admin|إرسال الاعتراض للإدارة
Submit Review|نشر التقييم
Submit for Admin Approval|إرسال لموافقة الإدارة
Submitted for Approval|تم الإرسال للموافقة
Submitting Venue Info…|جارٍ إرسال بيانات المنشأة…
Submitting…|جارٍ الإرسال…
Support & Help|الدعم والمساعدة
Surface|الأرضية
Surface Type|نوع الأرضية
Suspend|إيقاف الحساب
Suspended|موقوف
Switch to English|Switch to English
Switch to Player Account to Reserve|ادخل بحساب لاعب للحجز
System Health|حالة النظام
System Notifications|إشعارات النظام
System Stuck Items|العمليات المتعثرة
THE PLAYGROUND|ملعبك مستنيك
TOTAL PRICE|السعر الإجمالي
Test instant reservation lock and server webhook reconciliation via FakeGateway.|اختبر الحجز الفوري وتأكيد الدفع التجريبي على الخادم.
Thank you! Your verified match review has been posted.|شكراً لك! تم نشر تقييمك للمباراة.
The local checkout provider is not connected. This is not a paid booking.|خدمة الدفع المحلية غير متصلة. لم يُؤكد دفع هذا الحجز.
The pitch was in great condition...|الملعب كان بحالة ممتازة…
Thumbnail {{value0}}|صورة مصغرة {{value0}}
Time|الوقت
Timezone:|المنطقة الزمنية:
Today|اليوم
Today's Match-Day Lineup|جدول مباريات اليوم
Today's Matches|مباريات اليوم
Toggle navigation menu|فتح أو إغلاق قائمة التنقل
Toggle theme|تبديل المظهر
Tomorrow|غداً
Total Price|السعر الإجمالي
Total Price (EGP)|السعر الإجمالي (ج.م)
Total Released|إجمالي الرصيد المتاح
Total Venues|إجمالي المنشآت
Total historical platform releases|إجمالي الأرصدة المتاحة سابقاً
Trust Status: Good Standing (0 Strikes)|حالة الالتزام: جيدة (بدون مخالفات)
Try adjusting your search query, pitch size, or sport filters.|جرّب تعديل البحث أو حجم الملعب أو نوع الرياضة.
Try again|حاول مجدداً
Try switching the filter to "All (24h)" or select another match date.|اختر «الكل (24 ساعة)» أو حدد يوماً آخر للمباراة.
Turf|نجيل
Type|النوع
Unblock|رفع حظر الحجز
Unblocked|تم رفع حظر الحجز
Unknown|غير معروف
Unknown failure|خطأ غير معروف
Upcoming bookings and walk-in reservations will appear here with live match-day check-in controls.|تظهر هنا الحجوزات القادمة والمباشرة مع أدوات تسجيل الحضور.
Upcoming kickoff notifications 2 hours before match|تذكيرات بموعد البداية قبل المباراة بساعتين
Update Error|تعذر التحديث
Updates on cancellation previews and processed refunds|تحديثات تفاصيل الإلغاء والاستردادات المنفذة
Upheld|تم تأكيد المخالفة
Upload Error|تعذر الرفع
Upload Profile Photo|رفع صورة شخصية
Upload between 2 and 6 photos of this specific pitch directly from your device.|ارفع صورتين إلى 6 صور لهذا الملعب مباشرة من جهازك.
Upload photos directly from your computer / phone|ارفع الصور مباشرة من الكمبيوتر أو الهاتف
Upload pitch photos from your device / phone|ارفع صور الملعب من جهازك أو هاتفك
Upload profile photo|رفع صورة شخصية
Uploading Photo…|جارٍ رفع الصورة…
User Directory|دليل المستخدمين
User Directory & Account Status Controls|دليل المستخدمين وإدارة حالات الحسابات
User Status|حالة المستخدم
Users|المستخدمون
Users Management|إدارة المستخدمين
VENUE DUE|المستحق للملعب
VENUE OPERATIONS|عمليات المنشأة
Venue|المنشأة
Venue & Court Setup|إعداد المنشأة والملاعب
Venue & Location|المنشأة والموقع
Venue & Pitch Verification Queue|مراجعة المنشآت والملاعب
Venue & Pitches|المنشأة والملاعب
Venue / court|المنشأة / الملعب
Venue Active|المنشأة نشطة
Venue Approval Queue & Commission Rates|اعتماد المنشآت ونسب العمولة
Venue Name *|اسم المنشأة *
Venue Overview|ملخص المنشأة
Venue Partner|شريك المنصة
Venue Payout Batching & Bank Disbursals|دفعات المنشآت والتحويلات البنكية
Venue Photo {{value0}}|صورة المنشأة {{value0}}
Venue Photos (|صور المنشأة (
Venue Photos (Min 2, Max 6)|صور المنشأة (من صورتين إلى 6 صور)
Venue Response:|رد المنشأة:
Venue Setup|إعداد المنشأة
Venue Status Updated|تم تحديث حالة المنشأة
Venue Submitted|تم إرسال المنشأة
Venue details updated successfully.|تم تحديث بيانات المنشأة بنجاح.
Venue info, photos (min 2, max 3), and court setup sent successfully! Super Admin will review your venue listing.|تم إرسال بيانات المنشأة وصورها وإعدادات الملعب بنجاح. ستراجعها الإدارة.
Venue photos updated successfully.|تم تحديث صور المنشأة بنجاح.
Venue queue unavailable.|تعذر تحميل قائمة المنشآت.
Venue requires between 2 and 6 photos.|تحتاج المنشأة من صورتين إلى 6 صور.
Venue setup|إعداد المنشأة
Venue submitted to super admin for verification.|تم إرسال المنشأة للإدارة للتحقق منها.
Venue unavailable.|المنشأة غير متاحة.
Venues|المنشآت
Venues (|المنشآت (
Venues Approvals|اعتماد المنشآت
Venues Roster|قائمة المنشآت
Verified|معتمد
Verified Venue|منشأة معتمدة
Verified match|مباراة موثقة
Verified photos of turf quality, lighting, and court condition|صور موثقة لجودة النجيل والإضاءة وحالة الملعب
View Schedule|عرض الجدول
View all (|عرض الكل (
View in My Bookings →|عرض في حجوزاتي ←
View my bookings|عرض حجوزاتي
View {{value0}}|عرض {{value0}}
WELCOME BACK|أهلاً بعودتك
Walk-In Booking|حجز مباشر
Walk-in|حجز مباشر
Walk-in booking saved to schedule.|تم حفظ الحجز المباشر في الجدول.
We arrived on time but the pitch was locked...|وصلنا في الموعد لكن الملعب كان مغلقاً…
We could not load venues. Check your connection and try again.|تعذر تحميل الملاعب. تحقق من اتصالك وحاول مجدداً.
We lost the ball.|تعذر تحميل الملاعب.
We sent a verification link to|أرسلنا رابط التفعيل إلى
Welcome,|أهلاً،
What players say|آراء اللاعبين
WhatsApp Support Hotline|دعم واتساب
Winger / Speedster|جناح / لاعب سريع
You are currently logged in as an owner (|أنت مسجل الدخول كمالك (
You have 48 hours to submit your explanation for|لديك 48 ساعة لإرسال توضيحك بشأن
You have safely signed out of your account.|تم تسجيل خروجك بأمان.
You have safely signed out.|تم تسجيل خروجك بأمان.
You must upload between 2 and 6 photos for the venue.|يجب رفع صورتين إلى 6 صور للمنشأة.
You reviewed this match|قيّمت هذه المباراة
You will receive match confirmations, kickoff alerts, and payment receipts here.|ستصلك هنا تأكيدات المباريات وتذكيرات البداية وإيصالات الدفع.
Your 10-minute hold window for this slot expired to free availability for other players. Please choose your slot again.|انتهت مهلة الدفع البالغة 10 دقائق وأُتيح الموعد للاعبين الآخرين. اختر موعدك مجدداً.
Your Explanation|توضيحك
Your Revenue|إيراداتك
Your Sports Venue|منشأتك الرياضية
Your appeal has been submitted to admin oversight.|تم إرسال استئنافك للإدارة.
Your appeal has been submitted to super admin. You will be notified once reviewed.|تم إرسال استئنافك للإدارة. سنبلغك بعد مراجعته.
Your dispute was recorded. Admin will review within 48 hours.|تم تسجيل اعتراضك. ستراجعه الإدارة خلال 48 ساعة.
Your name|اسمك
Your owner account is verified by the Super Admin. Please send your venue details and initial pitch setup to start receiving reservations.|اعتمدت الإدارة حسابك كمالك. أرسل بيانات المنشأة وإعدادات الملعب الأول لبدء استقبال الحجوزات.
Your player attributes and positions have been saved.|تم حفظ بياناتك ومراكزك الرياضية.
Your profile photo has been uploaded and saved.|تم رفع صورتك الشخصية وحفظها.
Your request to register as a venue owner is currently pending approval by the Super Admin. You will be able to send your venue info, courts, and prices as soon as your account is approved.|طلبك للتسجيل كمالك منشأة بانتظار موافقة الإدارة. بعد الموافقة يمكنك إضافة المنشأة والملاعب والأسعار.
Your request to register as a venue owner on|طلبك للتسجيل كمالك منشأة على
Your reservation at|حجزك في
Your reservation is held, but payment has not been confirmed by the server.|الموعد محجوز مؤقتاً، ولم يُؤكد الدفع بعد.
Your reservation was cancelled and refund ledger recorded.|تم إلغاء الحجز وتسجيل الاسترداد في السجل المالي.
active|نشط
appeals open|استئنافات مفتوحة
approved pitches ready for booking|ملاعب معتمدة جاهزة للحجز
attempts|محاولات
available|متاح
consecutive hour|ساعة متتالية
consecutive hours|ساعات متتالية
court|ملعب
courts|ملاعب
done|تم
draft|مسودة
draft batches|دفعات مسودة
e.g. +20 100 123 4567|مثال: +20 100 123 4567
e.g. Al Ahly Arena or Gezira Sports Complex|مثال: ملاعب الأهلي أو مجمع الجزيرة الرياضي
e.g. Captain Mahmoud|مثال: كابتن محمود
e.g. Center Midfield, ST|مثال: وسط الملعب، مهاجم
e.g. Floodlight repair, Rain closure|مثال: إصلاح الإضاءة أو الإغلاق بسبب المطر
e.g. Pitch A (Turf)|مثال: ملعب أ (نجيل)
e.g. Plot 4, Fifth Settlement, Next to AUC, New Cairo|مثال: قطعة 4، التجمع الخامس، بجوار الجامعة الأمريكية، القاهرة الجديدة
football|كرة القدم
has been submitted to the Super Admin. Once approved, you will be able to set up and send your venue info, courts, and match-day rates.|تم إرساله للإدارة. بعد الموافقة يمكنك إعداد المنشأة والملاعب وأسعار المباريات وإرسالها.
home.|بيتك.
hr|ساعة
hrs|ساعات
is locked in. Show this code when you arrive at the pitch.|تم تأكيده. اعرض هذا الرمز عند وصولك إلى الملعب.
item|عنصر
mal3bna|ملعبنا
mal3bna is localized for Egyptian venues with full Arabic and Right-to-Left (RTL) layout support.|ملعبنا مصمم للملاعب المصرية ويدعم العربية واتجاه الكتابة من اليمين إلى اليسار.
of|من
of 6 photos selected|من 6 صور محددة
owners|ملاك
pending|قيد الانتظار
photo|صورة
players|لاعبون
s|
support@mal3bna.com|support@mal3bna.com
total reservations|إجمالي الحجوزات
upcoming|قادمة
uploaded|مرفوعة
venue|منشأة
venues|منشآت
you@example.com|you@example.com
your email address|بريدك الإلكتروني
{{value0}} EGP|{{value0}} ج.م
{{value0}} EGP / hr|{{value0}} ج.م / ساعة
{{value0}} EGP/hr|{{value0}} ج.م/ساعة
{{value0}} consecutive hours|{{value0}} ساعات متتالية
{{value0}} photo {{value1}}|{{value0}} صورة {{value1}}
· Cairo Time (Africa/Cairo)|· بتوقيت القاهرة
· auto-refreshes every 5 seconds|· تحديث تلقائي كل 5 ثوانٍ
العربية (RTL)|العربية (من اليمين لليسار)
• Africa/Cairo Time|• بتوقيت القاهرة
• Pitch Photos (|• صور الملعب (
• {{value0}}-a-side|• {{value0}} لاعبين لكل فريق
⏳ Dispute under review by admin|⏳ الاعتراض قيد مراجعة الإدارة
⏳ Pending Approval|⏳ بانتظار الموافقة
⏳ Pending Super Admin verification. This court cannot accept bookings until approved.|⏳ بانتظار مراجعة الإدارة. لن يُتاح حجز الملعب قبل الموافقة.
☀️ Afternoon (12:00 - 17:00)|☀️ بعد الظهر (12:00 - 17:00)
☀️ Outdoor|☀️ خارجي
☀️ Outdoor Pitch|☀️ ملعب خارجي
⚽ CAIRO · EGP · AFRICA/CAIRO|⚽ القاهرة · جنيه مصري · بتوقيت القاهرة
⚽ Football|⚽ كرة القدم
⚽ Player|⚽ لاعب
⚽ {{value0}}-a-side|⚽ {{value0}} لاعبين لكل فريق
✓ Active|✓ نشط
✓ Approve|✓ موافقة
✓ Approve Court|✓ اعتماد الملعب
✓ Arrived|✓ حضر
✓ Complete Match|✓ إكمال المباراة
✓ Overturn (Clear Strike)|✓ إلغاء المخالفة
✓ Selected Pitch|✓ الملعب المحدد
✕ Reject|✕ رفض
✕ Rejected|✕ مرفوض
✕ Uphold (Issue Strike)|✕ تأكيد المخالفة
🌅 Morning (06:00 - 12:00)|🌅 الصباح (06:00 - 12:00)
🌌 Night (23:00 - 06:00)|🌌 ليلاً (23:00 - 06:00)
🌙 Prime Evening (17:00 - 23:00)|🌙 المساء (17:00 - 23:00)
🎾 Padel|🎾 بادل
🏟️ Pitches Pending Verification|🏟️ ملاعب بانتظار الاعتماد
🏟️ Venue Owner|🏟️ مالك منشأة
🏠 Covered / Indoor|🏠 مغطى / داخلي
🏠 Indoor / Covered|🏠 داخلي / مغطى
💵 Remaining due at venue:|💵 المتبقي للدفع في الملعب:
🛡️ Note: All new courts require Super Admin review and approval before they can accept bookings.|🛡️ تتطلب الملاعب الجديدة مراجعة الإدارة وموافقتها قبل استقبال الحجوزات.
Could not save your language preference. Please try again.|تعذر حفظ تفضيل اللغة على حسابك. حاول مجدداً.
Select date…|اختر التاريخ…
Select option…|اختر…
January|يناير
February|فبراير
March|مارس
April|أبريل
May|مايو
June|يونيو
July|يوليو
August|أغسطس
September|سبتمبر
October|أكتوبر
November|نوفمبر
December|ديسمبر
Su|أحد
Mo|إثنين
Tu|ثلاثاء
We|أربعاء
Th|خميس
Fr|جمعة
Sa|سبت
player|لاعب
owner|مالك
admin|مشرف
booking|حجز إلكتروني
manual|حجز مباشر
block|فترة مغلقة
held|بانتظار الدفع
confirmed|مؤكد
arrived|حضر
completed|مكتمل
cancelled|ملغي
expired|منتهي الصلاحية
no_show_pending|بلاغ غياب قيد المراجعة
no_show|عدم الحضور
approved|معتمد
rejected|مرفوض
suspended|موقوف
blocked|محظور من الحجز
paid|مدفوع
failed|فشل
processed|تمت المعالجة
open|مفتوح
upheld|تم تأكيد المخالفة
overturned|تم إلغاء المخالفة
deposit|عربون
full|المبلغ بالكامل
refunded|مسترد
padel|بادل
{{count}} photos|{{count}} صور
{{count}} available venues|{{count}} منشآت متاحة
{{count}} courts|{{count}} ملاعب
{{count}} hours selected|تم اختيار {{count}} ساعات
Welcome back, {{name}}!|أهلاً بعودتك يا {{name}}!
Invalid email, phone number, or password|البريد الإلكتروني أو رقم الهاتف أو كلمة المرور غير صحيحة
Account is suspended|الحساب موقوف
Email is already registered|البريد الإلكتروني مسجل بالفعل
Mobile phone number is already registered|رقم الهاتف مسجل بالفعل
Please check your details and try again.|راجع بياناتك وحاول مرة أخرى.
Appeal decided: {{value0}}.|تم البت في الاستئناف: {{value0}}.
Commission rate set to {{value0}}%.|تم تحديد العمولة بنسبة {{value0}}٪.
Court "{{value0}}" has been rejected.|تم رفض الملعب «{{value0}}».
Court "{{value0}}" is now approved and active for public bookings.|تم اعتماد الملعب «{{value0}}» وأصبح متاحاً للحجز.
Dispute decided: {{value0}}. Strike and ledger updated.|تم البت في النزاع: {{value0}}. تم تحديث المخالفة والسجل المالي.
Loaded {{value0}} photo(s) from your device.|تم تحميل {{value0}} صور من جهازك.
Owner "{{value0}}" approved successfully. They can now submit venue info.|تم اعتماد المالك «{{value0}}» ويمكنه الآن إرسال بيانات المنشأة.
Payout marked as {{value0}}.|تم تحديث التحويل إلى {{value0}}.
User status updated to {{value0}}.|تم تحديث حالة المستخدم إلى {{value0}}.
Venue {{value0}} has been {{value1}}.|تم تحديث المنشأة {{value0}} إلى {{value1}}.
Welcome back, {{value0}}!|أهلاً بعودتك يا {{value0}}!
Welcome to mal3bna, {{value0}}! Your account is ready.|أهلاً بك في ملعبنا يا {{value0}}! حسابك جاهز.
Success|تم بنجاح
Attention|تنبيه
Note|ملاحظة
Today ({{date}})|اليوم ({{date}})
Select date & kickoff time…|اختر التاريخ وموعد البداية…
AM|ص
PM|م
Cairo Venue|منشأة بالقاهرة
Selected Court|الملعب المحدد
Test payment|دفع تجريبي
Test payment — no real money charged.|دفع تجريبي — لم يتم تحصيل أموال حقيقية.
Confirming test payment…|جارٍ تأكيد الدفع التجريبي…
Test checkout is unavailable|الدفع التجريبي غير متاح
Test payment could not be confirmed|تعذر تأكيد الدفع التجريبي
{{count}} available venue|{{count}} منشأة متاحة
Main navigation|التنقل الرئيسي
Mobile navigation|قائمة التنقل
Settings Navigation|أقسام الإعدادات
Loading…|جارٍ التحميل…
`;

export const webArabic: Record<string, string> = Object.fromEntries(
  copy
    .trim()
    .split('\n')
    .map((line) => {
      const separator = line.indexOf('|');
      return [line.slice(0, separator), line.slice(separator + 1)];
    }),
);
