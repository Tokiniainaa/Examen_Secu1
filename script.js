// Fonction pour effectuer l'appel API
async function getWhoAmI() {
    try {
        const response = await fetch("https://api.prod.jcloudify.com/whoami");
        if (!response.ok) {
            throw new Error("Erreur API");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        if (error.message === 'Erreur API') {
            return 'Forbidden';
        }
        // Si un Captcha est détecté
        if (error.message === 'Captcha') {
            const captchaUrl = error.captchaUrl;
            return await handleCaptcha(captchaUrl);
        }
        return 'Erreur inconnue';
    }
}

// Fonction pour gérer le captcha
async function handleCaptcha(captchaUrl) {
    // Demander à l'utilisateur de résoudre le captcha et retourner le résultat une fois fait
    let captchaAnswer = prompt("Veuillez résoudre le captcha et entrez la réponse:");
    if (captchaAnswer) {
        // Effectuer la requête une fois le captcha résolu
        return 'Forbidden';
    }
    return 'Captcha non résolu';
}

// Fonction pour générer la séquence
async function generateSequence() {
    const numberInput = document.getElementById("number-input").value;
    const resultContainer = document.getElementById("result-container");
    resultContainer.innerHTML = "<p>Génération de la séquence...</p>";

    let sequence = '';
    for (let i = 1; i <= numberInput; i++) {
        // Attente d'1 seconde entre chaque requête
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Appel à l'API et affichage du résultat
        const result = await getWhoAmI();
        sequence += `${i}. ${result}\n`;

        // Mise à jour de l'affichage en temps réel
        resultContainer.innerHTML = `<pre>${sequence}</pre>`;
    }
}

// Gestion du clic sur le bouton "Générer"
document.getElementById("submit-button").addEventListener("click", function () {
    generateSequence();
});
