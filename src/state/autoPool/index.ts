import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CakeVault, CakeVaultData, VaultFees, VaultUser } from 'state/types'
import { fetchPublicVaultData, fetchVaultFees } from './fetchVaultPublic'
import fetchVaultUser from './fetchVaultUser'

const initialState: CakeVault = {
  data: {
    totalShares: null,
    pricePerFullShare: null,
    totalCakeInVault: null,
    estimatedCakeBountyReward: null,
    totalPendingCakeHarvest: null,
    fees: {
      performanceFee: null,
      callFee: null,
      withdrawalFee: null,
      withdrawalFeePeriod: null,
    },
    userData: {
      isLoading: true,
      userShares: null,
      cakeAtLastUserAction: null,
      lastDepositedTime: null,
      lastUserActionTime: null,
      cakeBalance: '0',
    },
  },
}

// Thunks

export const fetchCakeVaultPublicData = createAsyncThunk<CakeVaultData>('cakeVault/fetchPublicData', async () => {
  const publicVaultInfo = await fetchPublicVaultData()
  return publicVaultInfo
})

export const fetchCakeVaultFees = createAsyncThunk<VaultFees>('cakeVault/fetchFees', async () => {
  const vaultFees = await fetchVaultFees()
  return vaultFees
})

export const fetchCakeVaultUserData = createAsyncThunk<VaultUser, { account: string }>(
  'cakeVault/fetchUser',
  async ({ account }) => {
    const userData = await fetchVaultUser(account)
    return userData
  },
)

export const Auto = createSlice({
  name: 'Auto',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Vault public data that updates frequently
    builder.addCase(fetchCakeVaultPublicData.fulfilled, (state, action: PayloadAction<CakeVaultData>) => {
      state.data = { ...state.data, ...action.payload }
    })
    // Vault fees
    builder.addCase(fetchCakeVaultFees.fulfilled, (state, action: PayloadAction<VaultFees>) => {
      const fees = action.payload
      state.data = { ...state.data, fees }
    })
    // Vault user data
    builder.addCase(fetchCakeVaultUserData.fulfilled, (state, action: PayloadAction<VaultUser>) => {
      const userData = action.payload
      userData.isLoading = false
      state.data = { ...state.data, userData }
    })
  },
})

// Actions

export default Auto.reducer
