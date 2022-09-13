import { useQuery } from '@tanstack/react-query'
import {useSandboxData} from './useSandbox';
import algosdk from 'algosdk';

export default function useWallets(enabled = false){

    const [sandbox] = useSandboxData()

    return useQuery(['wallets', sandbox], async () => {
		const key = new algosdk.Kmd(sandbox.kmd_token, "http://localhost", sandbox.kmd_port)
		let walletToken;
		const wallets = await key.listWallets()
		.then(res => key.initWalletHandle(res.wallets[0].id))
		.then(res => {
			walletToken = res.wallet_handle_token
			return key.listKeys(walletToken)
		}).then(async res => {
			const privateKeys = await Promise.all(res.addresses.map(async address => algosdk.secretKeyToMnemonic((await key.exportKey(walletToken, "", address)).private_key)))
			return res.addresses.map((address, i) => ({
				address: address,
				private_key: privateKeys[i]
			}))
		}).catch(e => [])

		if(wallets.length === 0) throw new Error('No Wallets Found')
		return wallets
	},{
		enabled: enabled,
		staleTime: Infinity,
		cacheTime: Infinity
	})
}