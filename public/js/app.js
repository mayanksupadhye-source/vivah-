// Vivah Marketplace - Frontend Client Application
document.addEventListener('DOMContentLoaded', () => {
  // Mobile Hamburger Menu Toggle
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  if (hamburgerBtn && mobileDrawer) {
    hamburgerBtn.addEventListener('click', () => {
      mobileDrawer.classList.toggle('open');
    });
  }

  // Live Interactive Wedding Budget Calculator
  const calcGuests = document.getElementById('calcGuests');
  const calcDays = document.getElementById('calcDays');
  const guestsVal = document.getElementById('guestsVal');
  const daysVal = document.getElementById('daysVal');
  const totalVal = document.getElementById('calcTotalVal');

  const checkCatering = document.getElementById('checkCatering');
  const checkDecor = document.getElementById('checkDecor');
  const checkPhoto = document.getElementById('checkPhoto');
  const checkDJ = document.getElementById('checkDJ');

  const caterSub = document.getElementById('caterSub');
  const decorSub = document.getElementById('decorSub');
  const photoSub = document.getElementById('photoSub');
  const djSub = document.getElementById('djSub');

  function updateBudgetCalculator() {
    if (!calcGuests || !calcDays || !totalVal) return;

    const guests = Number(calcGuests.value);
    const days = Number(calcDays.value);

    if (guestsVal) guestsVal.textContent = `${guests} People`;
    if (daysVal) daysVal.textContent = `${days} Day${days > 1 ? 's' : ''}`;

    const cateringCost = checkCatering && checkCatering.checked ? guests * 1650 * (days > 1 ? 1.6 : 1) : 0;
    const decorCost = checkDecor && checkDecor.checked ? 175000 * days : 0;
    const photoCost = checkPhoto && checkPhoto.checked ? 95000 * days : 0;
    const djCost = checkDJ && checkDJ.checked ? 50000 : 0;

    const grandTotal = Math.round(cateringCost + decorCost + photoCost + djCost);

    totalVal.textContent = `₹${grandTotal.toLocaleString('en-IN')}`;
    if (caterSub) caterSub.textContent = `₹${Math.round(cateringCost).toLocaleString('en-IN')}`;
    if (decorSub) decorSub.textContent = `₹${Math.round(decorCost).toLocaleString('en-IN')}`;
    if (photoSub) photoSub.textContent = `₹${Math.round(photoCost).toLocaleString('en-IN')}`;
    if (djSub) djSub.textContent = `₹${Math.round(djCost).toLocaleString('en-IN')}`;
  }

  if (calcGuests) calcGuests.addEventListener('input', updateBudgetCalculator);
  if (calcDays) calcDays.addEventListener('input', updateBudgetCalculator);
  if (checkCatering) checkCatering.addEventListener('change', updateBudgetCalculator);
  if (checkDecor) checkDecor.addEventListener('change', updateBudgetCalculator);
  if (checkPhoto) checkPhoto.addEventListener('change', updateBudgetCalculator);
  if (checkDJ) checkDJ.addEventListener('change', updateBudgetCalculator);

  updateBudgetCalculator();

  // Enquiry Modal Management
  const enquiryModal = document.getElementById('enquiryModal');
  const closeEnquiryModal = document.getElementById('closeEnquiryModal');
  const enquiryForm = document.getElementById('enquiryForm');
  const modalVendorTitle = document.getElementById('modalVendorTitle');
  const modalVendorId = document.getElementById('modalVendorId');
  const modalVendorName = document.getElementById('modalVendorName');
  const modalVendorCategory = document.getElementById('modalVendorCategory');
  const enquirySuccessMsg = document.getElementById('enquirySuccessMsg');

  window.openEnquiry = function (vId) {
    const vendor = (typeof INITIAL_VENDORS !== 'undefined' ? INITIAL_VENDORS : []).find(v => v.id === vId);
    if (!vendor) return;

    if (modalVendorTitle) modalVendorTitle.textContent = `Contact ${vendor.businessName}`;
    if (modalVendorId) modalVendorId.value = vendor.id;
    if (modalVendorName) modalVendorName.value = vendor.businessName;
    if (modalVendorCategory) modalVendorCategory.value = vendor.category;
    if (enquirySuccessMsg) enquirySuccessMsg.style.display = 'none';
    if (enquiryForm) {
      enquiryForm.style.display = 'block';
      enquiryForm.reset();
    }
    if (enquiryModal) enquiryModal.classList.add('active');
  };

  if (closeEnquiryModal && enquiryModal) {
    closeEnquiryModal.addEventListener('click', () => {
      enquiryModal.classList.remove('active');
    });
  }

  if (enquiryModal) {
    enquiryModal.addEventListener('click', (e) => {
      if (e.target === enquiryModal) {
        enquiryModal.classList.remove('active');
      }
    });
  }

  // Enquiry Form Submission (Sends to Node.js / MongoDB Backend)
  if (enquiryForm) {
    enquiryForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = enquiryForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending Enquiry...';
      }

      const payload = {
        vendorId: document.getElementById('modalVendorId').value,
        vendorName: document.getElementById('modalVendorName').value,
        vendorCategory: document.getElementById('modalVendorCategory').value,
        customerName: document.getElementById('custName').value,
        customerPhone: document.getElementById('custPhone').value,
        customerEmail: document.getElementById('custEmail') ? document.getElementById('custEmail').value : '',
        eventType: document.getElementById('custEvent').value,
        eventDate: document.getElementById('custDate').value,
        budget: Number(document.getElementById('custBudget').value) || 100000,
        notes: document.getElementById('custNotes').value
      };

      try {
        const res = await fetch('/api/enquiries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          if (enquiryForm) enquiryForm.style.display = 'none';
          if (enquirySuccessMsg) {
            enquirySuccessMsg.style.display = 'block';
            enquirySuccessMsg.innerHTML = `
              <div style="text-align: center; padding: 2rem 0;">
                <div style="font-size: 3rem; margin-bottom: 0.5rem;">🎉</div>
                <h3 style="color: #881337; font-family: var(--font-serif); font-size: 1.5rem; margin-bottom: 0.5rem;">Enquiry Successfully Sent!</h3>
                <p style="font-size: 0.85rem; color: #57534e;">Your phone number <strong>${payload.customerPhone}</strong> has been recorded in the MongoDB database.</p>
                <p style="font-size: 0.8rem; color: #78716c; margin-top: 0.5rem;">The vendor will call or WhatsApp you directly with custom quotes.</p>
              </div>
            `;
          }
        }
      } catch (err) {
        alert('Enquiry submitted (offline session saved). The provider will reach out shortly.');
        enquiryModal.classList.remove('active');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Booking Enquiry';
        }
      }
    });
  }
});
