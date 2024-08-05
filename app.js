// by kent _ add create and connect stellar wallet _2024-7-26
//Start

// Connect to the Stellar test network
// const StellarSdk = require('stellar-sdk');

// Connect to the Stellar test network
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

let sourceKeys;
let sourceAccount;

document.getElementById('connectButton').addEventListener('click', async () => {
    const publicKey = prompt('Enter your Stellar public key:');
    const secretKey = prompt('Enter your Stellar secret key:');
    if (publicKey && secretKey) {
        sourceKeys = StellarSdk.Keypair.fromSecret(secretKey);
        try {
            sourceAccount = await server.loadAccount(publicKey);
            let accountInfo = `Account ID: ${sourceAccount.id}\nBalances:\n`;
            sourceAccount.balances.forEach(balance => {
                accountInfo += `Type: ${balance.asset_type}, Balance: ${balance.balance}\n`;
            });
            document.getElementById('accountInfo').innerText = accountInfo;
            document.getElementById('sendPayment').disabled = false;            
        } catch (error) {
            console.error('Error loading account:', error);
            document.getElementById('accountInfo').innerText = 'Error loading account. Please check your public key.';
        }
    }
});

document.getElementById('sendPayment').addEventListener('click', async () => {
    const destination = prompt('Enter the destination Stellar public key:');
    const amount = prompt('Enter the amount to send:');
    if (destination && amount) {
        try {
            const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
                fee: await server.fetchBaseFee(),
                networkPassphrase: StellarSdk.Networks.TESTNET // Use the test network
            })
            .addOperation(StellarSdk.Operation.payment({
                destination: destination,
                asset: StellarSdk.Asset.native(),
                amount: amount
            }))
            .setTimeout(30)
            .build();

            transaction.sign(sourceKeys);

            const result = await server.submitTransaction(transaction);
            console.log('Transaction successful:', result);           
            alert('Transaction successful');
        } catch (error) {
            console.error('Transaction failed:', error);
            alert('Transaction failed. Please check the console for more details.');
        }
    }
});

document.getElementById('stellarport').addEventListener('click', () => {
    const publicKey = prompt('Enter your Stellar public key:');
    if (publicKey) {
        window.open(`https://stellarport.io/account/${publicKey}`, '_blank');
    }
});

document.getElementById('show-form-btn').addEventListener('click', () => {
    const form = document.getElementById('kyc-form');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
});

// Handle form submission
document.getElementById('kyc-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('name', document.getElementById('name').value);
    formData.append('email', document.getElementById('email').value);
    formData.append('document', document.getElementById('document').files[0]);

    try {
        const response = await fetch('https://api.jumio.com/v1/kyc/verify', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        document.getElementById('result').textContent = result.message;
    } catch (error) {
        document.getElementById('result').textContent = 'Error: ' + error.message;
    }
});

// by kent _ add create and connect stellar wallet_2024-7-26
//End