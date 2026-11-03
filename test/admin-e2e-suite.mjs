const U = 'https://lbcywxlfbdshflznapxf.supabase.co';
const K = 'sb_publishable_BaJ0UreLJbEfRKHXdhgCvw_EbTAHvKZ';

const H = (t) => ({
  apikey: K,
  Authorization: 'Bearer ' + (t || K),
  'Content-Type': 'application/json',
  Prefer: 'return=representation',
});

const json = async (r) => {
  const text = await r.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

let passed = 0;
let failed = 0;

function assert(name, condition, extra = null) {
  if (condition) {
    console.log(`[PASS] ${name}`);
    passed++;
  } else {
    console.error(`[FAIL] ${name}`, extra ? JSON.stringify(extra).slice(0, 300) : '');
    failed++;
  }
}

async function run() {
  console.log('--- 1. ANON SECURITY & ROLE ACCESS ---');
  
  // Anon cannot read PII
  const anonB = await fetch(`${U}/rest/v1/bookings?select=*`, { headers: H() });
  const anonBData = await json(anonB);
  assert('Anon blocked from reading bookings', anonB.status >= 400 || (Array.isArray(anonBData) && anonBData.length === 0), anonBData);

  const anonI = await fetch(`${U}/rest/v1/invoices?select=*`, { headers: H() });
  const anonIData = await json(anonI);
  assert('Anon blocked from reading invoices', anonI.status >= 400 || (Array.isArray(anonIData) && anonIData.length === 0), anonIData);

  const anonC = await fetch(`${U}/rest/v1/customers?select=*`, { headers: H() });
  const anonCData = await json(anonC);
  assert('Anon blocked from reading customers', anonC.status >= 400 || (Array.isArray(anonCData) && anonCData.length === 0), anonCData);

  // Anon is_admin returns false
  const anonAdminCheck = await fetch(`${U}/rest/v1/rpc/is_admin`, {
    method: 'POST',
    headers: H(),
    body: JSON.stringify({}),
  });
  const anonAdminVal = await json(anonAdminCheck);
  assert('Anon is_admin RPC returns false', anonAdminVal === false, anonAdminVal);

  // Anon can get availability without PII
  const slotsRes = await fetch(`${U}/rest/v1/rpc/get_booked_slots`, {
    method: 'POST',
    headers: H(),
    body: JSON.stringify({}),
  });
  const slots = await json(slotsRes);
  assert('Anon get_booked_slots RPC succeeds', Array.isArray(slots) && slots.length > 0 && slots[0].date && slots[0].time_slot && !slots[0].phone, slots);

  // Public catalog reads succeed
  const pkgs = await (await fetch(`${U}/rest/v1/service_packages?select=id,price&active=eq.true`, { headers: H() })).json();
  assert('Public catalog packages readable', Array.isArray(pkgs) && pkgs.length > 0, pkgs);

  console.log('\n--- 2. ADMIN AUTHENTICATION & ACCESS ---');

  const authRes = await fetch(`${U}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: H(),
    body: JSON.stringify({
      email: 'admin@amanikhalil.sa',
      password: 'AmaniAtelier2025!',
    }),
  });
  const authData = await json(authRes);
  const token = authData.access_token;
  assert('Admin login succeeds with HTTP 200', authRes.status === 200 && Boolean(token), authData);

  const adminCheck = await fetch(`${U}/rest/v1/rpc/is_admin`, {
    method: 'POST',
    headers: H(token),
    body: JSON.stringify({}),
  });
  const isAdmin = await json(adminCheck);
  assert('Admin is_admin RPC returns true', isAdmin === true, isAdmin);

  const adminBookings = await fetch(`${U}/rest/v1/bookings?select=id,ref,client_name`, { headers: H(token) });
  const adminBData = await json(adminBookings);
  assert('Admin can read bookings table', Array.isArray(adminBData) && adminBData.length > 0, adminBData);

  const adminInvoices = await fetch(`${U}/rest/v1/invoices?select=id,invoice_number`, { headers: H(token) });
  const adminIData = await json(adminInvoices);
  assert('Admin can read invoices table', Array.isArray(adminIData) && adminIData.length > 0, adminIData);

  const adminCustomers = await fetch(`${U}/rest/v1/customers?select=id,name,phone`, { headers: H(token) });
  const adminCData = await json(adminCustomers);
  assert('Admin can read customers table', Array.isArray(adminCData) && adminCData.length > 0, adminCData);

  console.log('\n--- 3. ADMIN DASHBOARD MUTATIONS & LIFECYCLE ---');

  const targetPkg = pkgs[0];
  const areaRes = await fetch(`${U}/rest/v1/riyadh_areas?select=id&limit=1`, { headers: H() });
  const targetArea = (await json(areaRes))[0];

  // A. Create booking via create_booking RPC
  const testRef = 'AK-E2E-' + Date.now();
  const createRes = await fetch(`${U}/rest/v1/rpc/create_booking`, {
    method: 'POST',
    headers: H(),
    body: JSON.stringify({
      p: {
        id: 'b-' + testRef,
        ref: testRef,
        client_name: 'سارة تجربة النظام',
        phone: '0599999999',
        package_id: targetPkg.id,
        date: '2030-11-15',
        time_slot: 'عصراً (02:00 م)',
        location_type: 'HOTEL_HALL',
        venue: 'فندق الريتز كارلتون',
        area_id: targetArea.id,
        status: 'PENDING_PAYMENT',
        addon_ids: [],
        notes: 'حجز تجريبي آلي للاختبار الشامل',
        invoice: {
          id: 'inv-' + testRef,
          invoice_number: 'INV-' + testRef,
          issue_date: '2030-11-15',
          payment_method: 'Apple Pay',
          status: 'بانتظار سداد العربون',
        },
      },
    }),
  });
  const createVal = await json(createRes);
  assert('Create booking via RPC succeeds', createRes.status === 200 && createVal.ref === testRef, createVal);

  // B. Admin updates booking status to CONFIRMED
  const updateConf = await fetch(`${U}/rest/v1/bookings?ref=eq.${testRef}`, {
    method: 'PATCH',
    headers: H(token),
    body: JSON.stringify({ status: 'CONFIRMED' }),
  });
  const confData = await json(updateConf);
  assert('Admin updates booking to CONFIRMED', Array.isArray(confData) && confData[0]?.status === 'CONFIRMED', confData);

  // C. Admin completes booking and marks invoice paid
  const updateComp = await fetch(`${U}/rest/v1/bookings?ref=eq.${testRef}`, {
    method: 'PATCH',
    headers: H(token),
    body: JSON.stringify({ status: 'COMPLETED' }),
  });
  const compData = await json(updateComp);
  assert('Admin updates booking to COMPLETED', Array.isArray(compData) && compData[0]?.status === 'COMPLETED', compData);

  const updateInv = await fetch(`${U}/rest/v1/invoices?booking_ref=eq.${testRef}`, {
    method: 'PATCH',
    headers: H(token),
    body: JSON.stringify({ status: 'مسدد بالكامل', remaining_balance: 0 }),
  });
  const invData = await json(updateInv);
  assert('Admin marks linked invoice as paid with 0 remaining balance', Array.isArray(invData) && invData[0]?.status === 'مسدد بالكامل' && invData[0]?.remaining_balance === 0, invData);

  // D. Admin updates customer notes
  const updateCust = await fetch(`${U}/rest/v1/customers?phone=eq.0599999999`, {
    method: 'PATCH',
    headers: H(token),
    body: JSON.stringify({ notes: 'تم التحديث بنجاح من لوحة تحكم CRM' }),
  });
  const custData = await json(updateCust);
  assert('Admin updates customer notes in CRM', Array.isArray(custData) && custData.length > 0, custData);

  // E. Admin manages blocked dates
  const testDate = '2030-12-25';
  const blockRes = await fetch(`${U}/rest/v1/blocked_dates`, {
    method: 'POST',
    headers: { ...H(token), Prefer: 'resolution=merge-duplicates,return=representation' },
    body: JSON.stringify({ date: testDate, reason: 'إجازة فنية' }),
  });
  const blockData = await json(blockRes);
  assert('Admin blocks date on calendar', Array.isArray(blockData) && blockData[0]?.date === testDate, blockData);

  const unblockRes = await fetch(`${U}/rest/v1/blocked_dates?date=eq.${testDate}`, {
    method: 'DELETE',
    headers: H(token),
  });
  assert('Admin unlocks date on calendar', unblockRes.status === 200 || unblockRes.status === 204, unblockRes.status);

  // F. Admin moderates reviews (toggle approved & featured)
  const revRes = await fetch(`${U}/rest/v1/reviews?select=id&limit=1`, { headers: H(token) });
  const revId = (await json(revRes))[0]?.id;
  if (revId) {
    const revPatch = await fetch(`${U}/rest/v1/reviews?id=eq.${revId}`, {
      method: 'PATCH',
      headers: H(token),
      body: JSON.stringify({ approved: true, featured: true }),
    });
    const revPatchData = await json(revPatch);
    assert('Admin toggles review approval & featured status', Array.isArray(revPatchData) && revPatchData.length > 0, revPatchData);
  }

  // G. Admin moderates blog posts
  const blogRes = await fetch(`${U}/rest/v1/blog_posts?select=id&limit=1`, { headers: H(token) });
  const blogId = (await json(blogRes))[0]?.id;
  if (blogId) {
    const blogPatch = await fetch(`${U}/rest/v1/blog_posts?id=eq.${blogId}`, {
      method: 'PATCH',
      headers: H(token),
      body: JSON.stringify({ published: true, featured: true }),
    });
    const blogPatchData = await json(blogPatch);
    assert('Admin updates blog post published & featured status', Array.isArray(blogPatchData) && blogPatchData.length > 0, blogPatchData);
  }

  // H. Test creating a booking on the default frontend date/slot (2025-10-18 + عصراً (02:00 م))
  const defaultSlotRef = 'AK-DEF-' + Date.now();
  const defRes = await fetch(`${U}/rest/v1/rpc/create_booking`, {
    method: 'POST',
    headers: H(),
    body: JSON.stringify({
      p: {
        id: 'b-' + defaultSlotRef,
        ref: defaultSlotRef,
        client_name: 'عروس افتراضية',
        phone: '0598888888',
        package_id: 'vip-bridal',
        date: '2025-10-18',
        time_slot: 'عصراً (02:00 م)',
        location_type: 'HOTEL_HALL',
        venue: 'فندق الريتز-كارلتون، الرياض',
        area_id: 'area_hotels_vip',
        status: 'CONFIRMED',
        addon_ids: ['addon_hair', 'addon_facial'],
        notes: 'اختبار التاريخ الافتراضي للواجهة',
        invoice: {
          id: 'inv-' + defaultSlotRef,
          invoice_number: 'INV-' + defaultSlotRef,
          issue_date: '2025-10-18',
          payment_method: 'Apple Pay',
          status: 'مدفوع العربون (30%)',
        },
      },
    }),
  });
  const defVal = await json(defRes);
  assert('Frontend default date/slot (2025-10-18 عصراً) booking syncs to backend without SLOT_TAKEN failure', defRes.status === 200 && defVal.ref === defaultSlotRef, defVal);

  // I. Test editing a service package from the Admin Dashboard and verifying DB persistence
  const origPrice = targetPkg.price;
  const newPrice = origPrice + 150;
  const editPkgRes = await fetch(`${U}/rest/v1/service_packages?id=eq.${targetPkg.id}`, {
    method: 'PATCH',
    headers: H(),
    body: JSON.stringify({
      price: newPrice,
      duration: '٥ ساعات تفرغ كامل',
      features: ['ميزة اختبار معدلة ١', 'ميزة اختبار معدلة ٢'],
      badge: 'شارة اختبار معدلة',
    }),
  });
  const editPkgData = await json(editPkgRes);
  assert(
    'Admin edits service package price and full details and persists to Supabase DB',
    Array.isArray(editPkgData) &&
      editPkgData[0]?.price === newPrice &&
      editPkgData[0]?.features?.includes('ميزة اختبار معدلة ١') &&
      editPkgData[0]?.badge === 'شارة اختبار معدلة',
    editPkgData
  );

  // Restore original package price and details
  await fetch(`${U}/rest/v1/service_packages?id=eq.${targetPkg.id}`, {
    method: 'PATCH',
    headers: H(),
    body: JSON.stringify({ price: origPrice, duration: '٤ إلى ٥ ساعات تفرغ كامل' }),
  });

  // I2. Test editing all blog post fields (title, author, author_role, read_time, cover_image) and verifying DB persistence
  const editBlogRes = await fetch(`${U}/rest/v1/blog_posts?id=eq.post-1`, {
    method: 'PATCH',
    headers: H(),
    body: JSON.stringify({
      title: 'عنوان تجريبي محدث بالكامل',
      author: 'أماني خليل المعتمدة',
      author_role: 'خبير دولي CIDESCO',
      read_time: '٦ دقائق قراءة',
      cover_image: '/gallery/IMG_5729.webp',
    }),
  });
  const editBlogData = await json(editBlogRes);
  assert(
    'Admin edits blog post details (title, author, author_role, read_time) and persists to Supabase DB',
    Array.isArray(editBlogData) &&
      editBlogData[0]?.title === 'عنوان تجريبي محدث بالكامل' &&
      editBlogData[0]?.author === 'أماني خليل المعتمدة' &&
      editBlogData[0]?.read_time === '٦ دقائق قراءة',
    editBlogData
  );

  // J. Test get_admin_dashboard_snapshot RPC returns full bookings, invoices, customers
  const snapRes = await fetch(`${U}/rest/v1/rpc/get_admin_dashboard_snapshot`, {
    method: 'POST',
    headers: H(),
    body: JSON.stringify({}),
  });
  const snapData = await json(snapRes);
  assert('get_admin_dashboard_snapshot RPC returns live bookings, invoices, and customers', Array.isArray(snapData?.bookings) && snapData.bookings.some((b) => b.ref === defaultSlotRef), snapData?.bookings?.length);

  // K. Clean up test records and verify cascading invoice deletion
  const delDefBooking = await fetch(`${U}/rest/v1/bookings?ref=eq.${defaultSlotRef}`, {
    method: 'DELETE',
    headers: H(token),
  });
  assert('Clean up default-slot test booking', delDefBooking.status === 200 || delDefBooking.status === 204, delDefBooking.status);
  await fetch(`${U}/rest/v1/customers?phone=eq.0598888888`, { method: 'DELETE', headers: H(token) });

  const delBooking = await fetch(`${U}/rest/v1/bookings?ref=eq.${testRef}`, {
    method: 'DELETE',
    headers: H(token),
  });
  assert('Admin deletes test booking', delBooking.status === 200 || delBooking.status === 204, delBooking.status);

  const invCheck = await fetch(`${U}/rest/v1/invoices?booking_ref=eq.${testRef}`, { headers: H(token) });
  const remainingInvs = await json(invCheck);
  assert('Cascading foreign key deleted corresponding invoice', Array.isArray(remainingInvs) && remainingInvs.length === 0, remainingInvs);

  await fetch(`${U}/rest/v1/customers?phone=eq.0599999999`, { method: 'DELETE', headers: H(token) });

  console.log(`\n========================================`);
  console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log(`========================================`);

  if (failed > 0) {
    process.exit(1);
  }
}

run().catch((err) => {
  console.error('Test runner fatal error:', err);
  process.exit(1);
});

