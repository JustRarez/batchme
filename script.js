document.getElementById("download-button").addEventListener("click", () => {
    const selectedApps = [];
    const checkboxes = document.querySelectorAll("input[type=checkbox]:checked");

    // Gather selected apps
    checkboxes.forEach((checkbox) => {
        const appName = checkbox.nextElementSibling.textContent.trim(); // App name from label
        const appId = checkbox.id.trim(); // App ID from the checkbox ID
        selectedApps.push({ name: appName, id: appId });
    });

    if (selectedApps.length === 0) {
        alert("Please select at least one app!");
        return;
    }

    // Generate batch script
    let batchScript = `@echo off\n:: Installer generated dynamically\n\n`;
    selectedApps.forEach(app => {
        batchScript += `
echo Searching for ${app.name}...
winget search "${app.name}"

echo Showing details for ${app.name}...
winget show "${app.name}"

echo Installing ${app.name} using ID: ${app.id}...
winget install "${app.id}"\n`;
    });

    batchScript += `
echo Installation complete.
pause`;

    // Create a Blob for the batch script
    const blob = new Blob([batchScript], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    // Create a temporary download link
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = "installer.bat"; // The name of the batch file
    document.body.appendChild(downloadLink);

    // Trigger the download
    downloadLink.click();

    // Clean up
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
});