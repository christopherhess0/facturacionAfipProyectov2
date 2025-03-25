import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  facturas: []
}

const facturaSlice = createSlice({
  name: 'facturas',
  initialState,
  reducers: {
    agregarFactura: (state, action) => {
      state.facturas.push({ id: Date.now(), ...action.payload })
    },
    eliminarFactura: (state, action) => {
      state.facturas = state.facturas.filter(f => f.id !== action.payload)
    },
    marcarComoFacturado: (state, action) => {
      const factura = state.facturas.find(f => f.id === action.payload)
      if (factura) factura.facturado = true
    },
    marcarFacturaHecha: (state, action) => {
      const factura = state.facturas.find(f => f.id === action.payload)
      if (factura) factura.facturaHecha = true
    },
    limpiarFacturas: (state) => {
      state.facturas = []
    }
  }
})

export const {
  agregarFactura,
  eliminarFactura,
  marcarComoFacturado,
  marcarFacturaHecha,
  limpiarFacturas
} = facturaSlice.actions

export default facturaSlice.reducer 