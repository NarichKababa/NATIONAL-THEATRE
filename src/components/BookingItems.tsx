import React from 'react';
import { Plus, Minus, ShoppingCart, X } from 'lucide-react';
import { useBooking } from '../context/BookingContext';

export default function BookingItems() {
  const { bookingItems, selectedItems, selectItem, removeItem } = useBooking();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'food': return '🍿';
      case 'merchandise': return '👕';
      case 'program': return '📖';
      default: return '🎭';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'food': return 'bg-orange-100 text-orange-800';
      case 'merchandise': return 'bg-purple-100 text-purple-800';
      case 'program': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalItemsAmount = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <ShoppingCart className="h-6 w-6 mr-2 text-amber-600" />
          Additional Items
        </h3>
        {selectedItems.length > 0 && (
          <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-semibold">
            {selectedItems.length} selected
          </span>
        )}
      </div>

      {/* Available Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {bookingItems.map((item) => {
          const selectedItem = selectedItems.find(si => si.id === item.id);
          const quantity = selectedItem?.quantity || 0;

          return (
            <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">{getCategoryIcon(item.category)}</span>
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                  <p className="text-lg font-bold text-amber-600">UGX {item.price.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => selectItem(item.id, Math.max(0, quantity - 1))}
                    disabled={quantity === 0}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center font-semibold">{quantity}</span>
                  <button
                    onClick={() => selectItem(item.id, quantity + 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {quantity > 0 && (
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Subtotal</p>
                    <p className="font-bold text-gray-900">UGX {(item.price * quantity).toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Items Summary */}
      {selectedItems.length > 0 && (
        <div className="border-t pt-6">
          <h4 className="font-semibold text-gray-900 mb-4">Selected Items</h4>
          <div className="space-y-3 mb-4">
            {selectedItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <span className="text-lg mr-2">{getCategoryIcon(item.category)}</span>
                  <div>
                    <h5 className="font-medium text-gray-900">{item.name}</h5>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-gray-900">
                    UGX {(item.price * item.quantity).toLocaleString()}
                  </span>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Items Total</span>
              <span className="text-xl font-bold text-amber-600">
                UGX {totalItemsAmount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}