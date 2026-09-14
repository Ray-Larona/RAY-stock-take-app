async function uploadStockTake() {

  // =========================================================
  // PRE-CHECK
  // =========================================================
  if (!currentLocation) {
    alert("Please set location first");
    return;
  }

  if (stockItems.length === 0) {
    alert("No items to upload");
    return;
  }

  // =========================================================
  // GET BUTTON & OVERLAY
  // =========================================================
  const btn = document.getElementById("uploadBtn");
  const overlay = document.getElementById("loadingOverlay");
  const loadingText = document.getElementById("loadingText");

  // =========================================================
  // EXTRA LOCK: Prevent double upload
  // =========================================================
  if (btn && btn.dataset.uploading === "true") {
    return;
  }

  // =========================================================
  // SHOW LOADING OVERLAY
  // =========================================================
  if (loadingText) {
    loadingText.innerHTML = "📤 UPLOADING ITEMS...<br><span style='font-size: 13px; color: #ccc; font-weight: normal;'>Please wait, do not close or refresh.</span>";
  }
  if (overlay) {
    overlay.style.display = "flex";
  }

  // LOCK BUTTON IMMEDIATELY
  if (btn) {
    btn.dataset.uploading = "true";
    btn.disabled = true;
    btn.innerHTML = "⏳ UPLOADING...";
  }

  // =========================================================
  // SAVE CURRENT DATA TO PREVENT MODIFICATION DURING UPLOAD
  // =========================================================
  const uploadLocation = currentLocation;
  const uploadItems = stockItems.slice();
  const token = localStorage.getItem("token");

  try {
    // =======================================================
    // SEND UPLOAD (Fast fetch with text/plain to bypass CORS delay)
    // =======================================================
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify({
        action: "uploadStockTake",
        token: token,
        location: uploadLocation,
        items: uploadItems
      })
    });

    // =======================================================
    // CHECK SERVER RESPONSE
    // =======================================================
    if (!response.ok) {
      throw new Error("Server error: " + response.status);
    }

    const result = await response.json();

    // =======================================================
    // SUCCESS
    // =======================================================
    if (result.success) {
      alert("✅ Upload Successful!\n\nBatch: " + result.batchID);

      // Clear only items
      stockItems = [];
      localStorage.removeItem("stockItems");

      // Refresh display
      displayItems();

      // Reset barcode display
      const barcodeText = document.getElementById("barcode");
      if (barcodeText) {
        barcodeText.innerText = "---";
      }

      // Reset total
      const total = document.getElementById("total");
      if (total) {
        total.innerText = "0";
      }
    } else {
      alert(result.message || "Upload failed");
    }

  } catch (err) {
    alert("Upload failed.\n" + err.message);
  } finally {
    // =======================================================
    // UNLOCK EVERYTHING (Executed on success or error)
    // =======================================================
    if (overlay) {
      overlay.style.display = "none";
    }

    if (btn) {
      btn.dataset.uploading = "false";
      btn.disabled = false;
      btn.innerHTML = "📤 UPLOAD LIST";
    }
  }

}
