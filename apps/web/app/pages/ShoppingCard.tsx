import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrashIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/solid'

type CartItem = {
  id: number
  name: string
  price: number
  quantity: number
  image: string
}

const initialCartItems: CartItem[] = [
  { id: 1, name: "Stylish T-Shirt", price: 29.99, quantity: 2, image: "/placeholder.svg?height=80&width=80" },
  { id: 2, name: "Comfortable Jeans", price: 59.99, quantity: 1, image: "/placeholder.svg?height=80&width=80" },
  { id: 3, name: "Running Shoes", price: 89.99, quantity: 1, image: "/placeholder.svg?height=80&width=80" },
]

export function ShoppingCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems)

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id))
  }

  const updateQuantity = (id: number, newQuantity: number) => {
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
    ))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = 10
  const total = subtotal + shipping

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <AnimatePresence>
            {cartItems.map(item => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="card card-side bg-base-100 shadow-xl mb-4"
              >
                <figure className="w-24 h-24">
                  <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                </figure>
                <div className="card-body p-4">
                  <h3 className="card-title text-lg">{item.name}</h3>
                  <p className="text-base-content text-opacity-60">${item.price.toFixed(2)}</p>
                  <div className="flex items-center mt-2">
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      aria-label={`Decrease quantity of ${item.name}`}
                    >
                      <MinusIcon className="w-4 h-4" />
                    </button>
                    <span className="mx-2">{item.quantity}</span>
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label={`Increase quantity of ${item.name}`}
                    >
                      <PlusIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="card-actions justify-end p-4">
                  <button
                    className="btn btn-ghost btn-circle"
                    onClick={() => removeItem(item.id)}
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    <TrashIcon className="w-5 h-5 text-error" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {cartItems.length === 0 && (
            <div className="alert alert-info">
              <div>
                <span>Your cart is empty</span>
              </div>
            </div>
          )}
        </div>
        <div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Summary</h2>
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="divider my-2"></div>
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="card-actions justify-end mt-4">
                <button className="btn btn-primary btn-block">Proceed to Checkout</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}