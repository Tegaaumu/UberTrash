// by kent _ add create and connect stellar wallet _2024-7-26
//End

document.addEventListener('DOMContentLoaded', () => {
    const StellarSdk = window.StellarSdk;

    document.getElementById('createButton').addEventListener('click', async () => {
        const statusElement = document.getElementById('status');
        const accountInfoElement = document.getElementById('accountInfo');

        try {
            // Generate a new keypair
            const pair = StellarSdk.Keypair.random();

            // Display public and secret keys
            console.log('Public Key:', pair.publicKey());
            console.log('Secret Key:', pair.secret());

            statusElement.innerHTML = `
                <strong>Public Key:</strong> ${pair.publicKey()}<br>
                <strong>Secret Key:</strong> ${pair.secret()}
            `;

            // Fund the account using Friendbot (testnet only)
            // For mainnet, you need to fund the account using real XLM
            const response = await fetch(`https://friendbot.stellar.org/?addr=${pair.publicKey()}`);
            const responseJSON = await response.json();

            if (response.status === 200) {
                accountInfoElement.textContent = 'Account successfully created and funded on the testnet.';
                console.log('Friendbot response:', responseJSON);
            } else {
                throw new Error(responseJSON.detail);
            }
        } catch (error) {
            console.error('Error creating account:', error);
            statusElement.textContent = 'Error creating account. See console for details.';
        }
    });

    document.getElementById('connectButton').addEventListener('click', async () => {
        const statusElement = document.getElementById('status');
        const accountInfoElement = document.getElementById('accountInfo');

        // Prompt the user to enter their Stellar public key
        const publicKey = prompt('Please enter your Stellar public key:');

        if (!publicKey) {
            statusElement.textContent = 'Public key is required.';
            return;
        }

        if (!StellarSdk.StrKey.isValidEd25519PublicKey(publicKey)) {
            statusElement.textContent = 'Invalid public key format.';
            accountInfoElement.innerHTML = '';
            return;
        }

        try {
            // Create a server instance
            const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

            // Load account details
            const account = await server.loadAccount(publicKey);
            statusElement.textContent = 'Connected to Stellar account: ' + publicKey;
            console.log('Account details:', account);

            // Display account balances
            accountInfoElement.innerHTML = 'Balances:<br>';
            account.balances.forEach(balance => {
                accountInfoElement.innerHTML += `Asset: ${balance.asset_type}, Balance: ${balance.balance}<br>`;
            });
        } catch (error) {
            console.error('Error connecting to Stellar:', error);
            statusElement.textContent = 'Error connecting to Stellar. See console for details.';

            if (error.response && error.response.status === 400) {
                statusElement.textContent = 'Bad request: Invalid public key or unfunded account.';
                
            } else {
                statusElement.textContent = 'An error occurred: ' + error.message;
            }
        }
    });
});

// by kent _ add create and connect stellar wallet_2024-7-26
//End