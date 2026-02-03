const BASE_URL = "http://localhost:5050/api/donations";

// -------- TYPES (optional but good)
export type DonationPayload = any;

// -------- API FUNCTIONS
async function getDonations(donorId: string) {
  const res = await fetch(`${BASE_URL}/list/${donorId}`);
  if (!res.ok) throw new Error("Failed to fetch donations");
  return res.json();
}

async function addDonation(donation: DonationPayload) {
  const res = await fetch(`${BASE_URL}/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(donation),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  return res.json();
}

async function claimDonation(donationId: string, ngoId: string) {
  const res = await fetch(`${BASE_URL}/${donationId}/claim`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ngo_id: ngoId }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Failed to claim donation");
  }

  return res.json();
}

// 🔥 EXPLICIT EXPORT (THIS FIXES IT)
export {
  getDonations,
  addDonation,
  claimDonation,
};

export const cancelNgoClaim = async (donationId: string, ngoId: string) => {
  const res = await fetch(
    `http://localhost:5050/api/ngo/claims/${donationId}/cancel`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ngo_id: ngoId }),
    }
  );

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Failed to cancel claim");
  }
};


export const fetchNgoStats = async (ngoId: string) => {
  const res = await fetch(
    `http://localhost:5050/api/ngo-dashboard/stats?ngoId=${ngoId}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch NGO stats");
  }

  return res.json();
};
