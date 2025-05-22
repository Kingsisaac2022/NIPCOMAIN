import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Check, X, FileText, AlertTriangle, CheckCircle, XCircle, Download } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import Header from '../components/Header';
import Button from '../components/Button';
import FileUpload from '../components/FileUpload';
import InputField from '../components/InputField';
import BottomNav from '../components/BottomNav';

const PurchaseOrderPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { purchaseOrders, updatePurchaseOrder, driverOffloads } = useAppContext();
  
  const order = purchaseOrders.find(o => o.id === parseInt(orderId || '0'));
  const offload = driverOffloads.find(o => o.orderId === order?.id);
  
  const [paymentReceipt, setPaymentReceipt] = useState<File | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [error, setError] = useState('');
  const [showActions, setShowActions] = useState(false);
  
  const handleFileSelected = (file: File) => {
    setPaymentReceipt(file);
    setError('');
  };
  
  const handleUpdateStatus = async (newStatus: 'Active' | 'Rejected') => {
    if (!order) return;
    
    if (newStatus === 'Active' && !paymentReceipt) {
      setError('Please upload payment receipt before activating the order');
      return;
    }
    
    if (newStatus === 'Rejected' && !rejectionReason.trim()) {
      setError('Please provide a reason for rejection');
      return;
    }
    
    if (newStatus === 'Rejected') {
      const updatedOrder = {
        ...order,
        status: newStatus,
        rejectionReason: rejectionReason.trim()
      };
      
      updatePurchaseOrder(updatedOrder);
      navigate('/ceo');
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      if (!order) return;
      
      const updatedOrder = {
        ...order,
        status: newStatus,
        receipts: {
          ...order.receipts,
          payment: reader.result as string
        }
      };
      
      updatePurchaseOrder(updatedOrder);
      navigate('/ceo');
    };
    
    if (paymentReceipt) {
      reader.readAsDataURL(paymentReceipt);
    }
  };
  
  const handleDownloadReceipt = () => {
    if (!order?.receipts?.payment) return;
    
    const link = document.createElement('a');
    link.href = order.receipts.payment;
    link.download = `payment-receipt-${order.id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-text">Purchase order not found</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Purchase Order Details" showBack stationId={1} />
      
      <main className="page-container fade-in py-12">
        <div className="card">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold">{order.stationName}</h2>
              <p className="text-text-secondary mt-1">
                Created on {order.dateCreated} at {order.timeCreated}
              </p>
            </div>
            <span className={`
              px-3 py-1.5 rounded-full text-sm font-medium
              ${order.status === 'Active' 
                ? 'bg-success/10 text-success' 
                : order.status === 'Rejected'
                ? 'bg-error/10 text-error'
                : 'bg-warning/10 text-warning'}
            `}>
              {order.status}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Order Details</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-text-secondary">Product Type</label>
                  <p className="font-medium">{order.productType}</p>
                </div>
                
                <div>
                  <label className="text-text-secondary">Expected Volume</label>
                  <p className="font-medium">{order.totalVolume.toLocaleString()} liters</p>
                </div>
                
                {offload && (
                  <div className="pt-4 border-t border-gray-700">
                    <label className="text-text-secondary">Arrived Volume</label>
                    <p className="font-medium">{offload.volumeArrived.toLocaleString()} liters</p>
                    
                    <div className="mt-2">
                      <label className="text-text-secondary">Volume Difference</label>
                      <p className={`font-medium ${
                        offload.volumeArrived < order.totalVolume ? 'text-error' : 'text-success'
                      }`}>
                        {(offload.volumeArrived - order.totalVolume).toLocaleString()} liters
                      </p>
                    </div>
                  </div>
                )}
                
                <div>
                  <label className="text-text-secondary">Cost per Unit</label>
                  <p className="font-medium">₦{order.productCostPerUnit.toLocaleString()}</p>
                </div>
                
                <div>
                  <label className="text-text-secondary">Total Cost</label>
                  <p className="font-medium">₦{order.totalCost.toLocaleString()}</p>
                </div>
                
                <div>
                  <label className="text-text-secondary">Transport Cost</label>
                  <p className="font-medium">₦{order.transportCost.toLocaleString()}</p>
                </div>
                
                <div className="pt-4 border-t border-gray-700">
                  <label className="text-text-secondary">Final Total Cost</label>
                  <p className="text-xl font-bold text-primary">
                    ₦{order.finalTotalCost.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Payment & Status</h3>
              
              {order.status === 'Pending' ? (
                <>
                  <FileUpload
                    label="Payment Receipt"
                    onFileSelected={handleFileSelected}
                    accept="application/pdf"
                    required={!showActions}
                    error={error}
                  />
                  
                  <div className="mt-6 space-y-4">
                    {!showActions ? (
                      <Button
                        onClick={() => setShowActions(true)}
                        icon={<FileText size={20} />}
                        fullWidth
                      >
                        Update Order Status
                      </Button>
                    ) : (
                      <>
                        <Button
                          onClick={() => handleUpdateStatus('Active')}
                          icon={<CheckCircle size={20} />}
                          variant="primary"
                          fullWidth
                        >
                          Approve Order
                        </Button>
                        
                        <div className="space-y-2">
                          <InputField
                            label="Rejection Reason"
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Enter reason for rejection"
                          />
                          
                          <Button
                            onClick={() => handleUpdateStatus('Rejected')}
                            icon={<XCircle size={20} />}
                            variant="danger"
                            fullWidth
                          >
                            Reject Order
                          </Button>
                        </div>
                        
                        <Button
                          onClick={() => setShowActions(false)}
                          variant="outline"
                          fullWidth
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                    
                    {error && (
                      <div className="flex items-center mt-4 text-error">
                        <AlertTriangle size={20} className="mr-2" />
                        <p>{error}</p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="border-2 border-gray-700 rounded-lg p-4">
                  <div className="flex items-center mb-4">
                    {order.status === 'Active' ? (
                      <>
                        <Check size={20} className="text-success mr-2" />
                        <span className="text-success">Order is approved</span>
                      </>
                    ) : (
                      <>
                        <X size={20} className="text-error mr-2" />
                        <span className="text-error">Order is rejected</span>
                        {order.rejectionReason && (
                          <p className="mt-2 text-text-secondary">
                            Reason: {order.rejectionReason}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                  
                  {order.receipts?.payment && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText size={20} className="text-primary mr-2" />
                        <span className="text-text-secondary">Payment receipt uploaded</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownloadReceipt}
                        icon={<Download size={16} />}
                      >
                        Download
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default PurchaseOrderPage;