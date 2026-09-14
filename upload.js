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
  // GET BUTTON
  // =========================================================
  const btn = document.getElementById("uploadBtn");

  // =========================================================
  // EXTRA LOCK: Prevent double upload
  // =========================================================
  if (btn && btn.dataset.uploading === "true") {
    return;
  }

  // =========================================================
  // FULL-SCREEN LOCK / LOADING OVERLAY
  // (Hinaharangan nito ang buong screen para hindi makapag-click ang user)
  // =========================================================
  let overlay = document.getElementById("uploadLoadingOverlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "uploadLoadingOverlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    overlay.style.display = "flex";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.zIndex = "9999";
    overlay.innerHTML = `
      <div style="background: white; color: #333; padding: 25px 35px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.3); text-align: center; font-family: sans-serif;">
        <div style="font-size: 24px; margin-bottom: 10px;">⏳</div>
        <div style="font-size: 16px; font-weight: bold;">UPLOADING ITEMS...</div>
        <div style="font-size: 13px; color: #666; margin-top: 5px;">Please wait, do not close or refresh.</div>
      </div>
    `;
    document.body.appendChild(overlay);
  } else {
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
      btn.innerHTML = "📤 UPLOAD LOCATION";
    }
  }

}
