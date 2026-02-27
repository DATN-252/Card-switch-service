'use client';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard, faCheckCircle, faTimesCircle, faArrowLeft, faStore, faWifi, faPrint } from '@fortawesome/free-solid-svg-icons';

export default function PosSimulator() {
  const [amount, setAmount] = useState('0');
  const [pan, setPan] = useState('9999888877776666'); // Default to a valid PAN length 16
  const [merchantId, setMerchantId] = useState('POS-BK-001');
  const [merchantName, setMerchantName] = useState('BKBank Test Store');

  const [status, setStatus] = useState<'IDLE' | 'PROCESSING' | 'APPROVED' | 'DECLINED' | 'ERROR'>('IDLE');
  const [receiptData, setReceiptData] = useState<any>(null);

  const handleKeyPress = (num: string) => {
    if (status !== 'IDLE' && status !== 'ERROR') return;

    setAmount(prev => {
      if (prev === '0') return num;
      if (prev.length >= 10) return prev; // max length
      return prev + num;
    });
  };

  const handleClear = () => {
    if (status !== 'IDLE' && status !== 'ERROR') return;
    setAmount('0');
  };

  const handleDelete = () => {
    if (status !== 'IDLE' && status !== 'ERROR') return;
    setAmount(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
  };

  const handleReset = () => {
    setStatus('IDLE');
    setAmount('0');
    setReceiptData(null);
  };

  const processPayment = async () => {
    if (amount === '0' || !pan) return;

    setStatus('PROCESSING');

    try {
      const res = await fetch('/api/pos/swipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pan: pan,
          amount: Number(amount),
          merchantId: merchantId,
          merchantName: merchantName
        })
      });

      const data = await res.json();

      if (data.status === 'APPROVED') {
        setStatus('APPROVED');
      } else {
        setStatus('DECLINED');
      }
      setReceiptData({ ...data, amount });
    } catch (err) {
      console.error(err);
      setStatus('ERROR');
    }
  };

  return (
    <div style={{ padding: '2rem', width: '100%', maxWidth: '600px' }}>
      <div className="glass-panel" style={{ padding: '2rem', borderRadius: '1.5rem', position: 'relative' }}>

        {/* Top Status Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', color: 'var(--pos-border)', fontSize: '0.875rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8' }}>
            <FontAwesomeIcon icon={faStore} /> {merchantId}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981' }}>
            <FontAwesomeIcon icon={faWifi} /> ONLINE
          </div>
        </div>

        {/* Dynamic Display Screen */}
        <div className="pos-screen" style={{ minHeight: '180px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {status === 'IDLE' || status === 'ERROR' ? (
            <>
              <div style={{ color: '#94a3b8', fontSize: '1.125rem', marginBottom: '0.5rem', textAlign: 'center' }}>
                Số tiền thanh toán (USD)
              </div>
              <div style={{ color: 'white', fontSize: '3.5rem', fontWeight: 700, textAlign: 'center', letterSpacing: '0.1em' }}>
                $ {Number(amount).toLocaleString('en-US')}
              </div>
              {status === 'ERROR' && (
                <div style={{ color: 'var(--pos-danger)', textAlign: 'center', marginTop: '1rem', fontSize: '0.875rem' }}>
                  Lỗi kết nối máy chủ Mạng lõi (jPOS)
                </div>
              )}
            </>
          ) : status === 'PROCESSING' ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', color: 'var(--pos-accent)', marginBottom: '1rem' }} className="animate-pulse">
                <FontAwesomeIcon icon={faCreditCard} />
              </div>
              <div style={{ color: 'white', fontSize: '1.5rem', fontWeight: 600 }}>Đang xử lý giao dịch...</div>
              <div style={{ color: '#94a3b8', marginTop: '0.5rem' }}>Vui lòng giữ thẻ</div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: status === 'APPROVED' ? 'var(--pos-success)' : 'var(--pos-danger)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                <FontAwesomeIcon icon={status === 'APPROVED' ? faCheckCircle : faTimesCircle} />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'white' }}>
                {status === 'APPROVED' ? 'GIAO DỊCH CHẤP THUẬN' : 'GIAO DỊCH BỊ TỪ CHỐI'}
              </div>
            </div>
          )}

        </div>

        {/* Controls */}
        <div style={{ display: (status === 'APPROVED' || status === 'DECLINED') ? 'none' : 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Số Thẻ</label>
            <input
              type="text"
              value={pan}
              onChange={(e) => setPan(e.target.value)}
              style={{
                width: '100%', padding: '0.75rem 1rem', borderRadius: '8px',
                background: 'rgba(0,0,0,0.2)', border: '1px solid var(--pos-border)', color: 'white', fontFamily: 'monospace', fontSize: '0.875rem'
              }}
              disabled={status === 'PROCESSING'}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Mã Merchant (ID)</label>
            <input
              type="text"
              value={merchantId}
              onChange={(e) => setMerchantId(e.target.value)}
              style={{
                width: '100%', padding: '0.75rem 1rem', borderRadius: '8px',
                background: 'rgba(0,0,0,0.2)', border: '1px solid var(--pos-border)', color: 'white', fontFamily: 'monospace', fontSize: '0.875rem'
              }}
              disabled={status === 'PROCESSING'}
            />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Tên Merchant</label>
            <input
              type="text"
              value={merchantName}
              onChange={(e) => setMerchantName(e.target.value)}
              style={{
                width: '100%', padding: '0.75rem 1rem', borderRadius: '8px',
                background: 'rgba(0,0,0,0.2)', border: '1px solid var(--pos-border)', color: 'white', fontFamily: 'monospace', fontSize: '0.875rem'
              }}
              disabled={status === 'PROCESSING'}
            />
          </div>
        </div>

        {(status === 'APPROVED' || status === 'DECLINED' || status === 'ERROR') && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <button onClick={handleReset} className="numpad-btn" style={{ background: '#475569', padding: '0 2rem', height: '44px', fontSize: '1rem', width: 'auto' }}>
              <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '0.5rem' }} /> Quay lại thao tác mới
            </button>
          </div>
        )}

        {/* Numpad */}
        <div style={{ display: (status === 'APPROVED' || status === 'DECLINED') ? 'none' : 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', opacity: status !== 'IDLE' && status !== 'ERROR' ? 0.5 : 1, pointerEvents: status !== 'IDLE' && status !== 'ERROR' ? 'none' : 'auto' }}>
          <button className="numpad-btn" onClick={() => handleKeyPress('1')}>1</button>
          <button className="numpad-btn" onClick={() => handleKeyPress('2')}>2</button>
          <button className="numpad-btn" onClick={() => handleKeyPress('3')}>3</button>
          <button className="numpad-btn action-danger" onClick={handleClear}>C</button>

          <button className="numpad-btn" onClick={() => handleKeyPress('4')}>4</button>
          <button className="numpad-btn" onClick={() => handleKeyPress('5')}>5</button>
          <button className="numpad-btn" onClick={() => handleKeyPress('6')}>6</button>
          <button className="numpad-btn" onClick={handleDelete} style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', borderColor: 'rgba(245, 158, 11, 0.5)' }}>⌫</button>

          <button className="numpad-btn" onClick={() => handleKeyPress('7')}>7</button>
          <button className="numpad-btn" onClick={() => handleKeyPress('8')}>8</button>
          <button className="numpad-btn" onClick={() => handleKeyPress('9')}>9</button>
          <button className="numpad-btn action-primary" style={{ gridRow: 'span 2', height: 'auto' }} onClick={processPayment}>
            Thanh<br />Toán
          </button>

          <button className="numpad-btn" onClick={() => handleKeyPress('00')}>00</button>
          <button className="numpad-btn" onClick={() => handleKeyPress('0')}>0</button>
          <button className="numpad-btn" onClick={() => handleKeyPress('.')}>.</button>
        </div>

        {/* Receipt Flow (Not Absolute) */}
        {(status === 'APPROVED' || status === 'DECLINED') && receiptData && (
          <div style={{ display: 'flex', justifyContent: 'center', overflow: 'hidden', padding: '0 1rem 1rem 1rem', margin: '0 -1rem' }}>
            <div className="receipt" style={{ width: '100%', maxWidth: '400px', fontSize: '0.8125rem', lineHeight: '1.4', padding: '1.5rem 1rem', borderRadius: '0 0 12px 12px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>

              {/* Header */}
              <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <FontAwesomeIcon icon={faPrint} style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }} />
                <div style={{ fontWeight: 700, fontSize: '1.125rem', textTransform: 'uppercase' }}>{merchantName}</div>
                <div>Địa chỉ: 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội</div>
                <div>Điện thoại: 024.3869.2222</div>
                <div>MST: 0100123456</div>
              </div>

              <div style={{ borderTop: '1px dashed #94a3b8', margin: '0.5rem 0' }}></div>

              {/* Terminal Info */}
              <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.25rem' }}>
                <div>Merchant ID (MID):</div><div style={{ textAlign: 'right', fontWeight: 600 }}>{merchantId}</div>
                <div>Terminal ID (TID):</div><div style={{ textAlign: 'right', fontWeight: 600 }}>TID-0001</div>
                <div>Invoice No:</div><div style={{ textAlign: 'right', fontWeight: 600 }}>INV-{Math.floor(100000 + Math.random() * 900000)}</div>
                <div>Batch No:</div><div style={{ textAlign: 'right', fontWeight: 600 }}>000001</div>
              </div>

              <div style={{ borderTop: '1px dashed #94a3b8', margin: '0.5rem 0' }}></div>

              {/* Date & Time */}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>Ngày: {new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}</div>
                <div>Giờ: {new Date().toLocaleTimeString('vi-VN', { hour12: false })}</div>
              </div>

              <div style={{ marginTop: '0.5rem' }}>
                <div>Loại giao dịch: <span style={{ fontWeight: 600 }}>SALE</span></div>
                <div>Phương thức: <span style={{ fontWeight: 600 }}>Chip / Contactless</span></div>
              </div>

              <div style={{ borderTop: '1px dashed #94a3b8', margin: '0.5rem 0' }}></div>

              {/* Card Info */}
              <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.25rem' }}>
                <div>Loại thẻ:</div><div style={{ textAlign: 'right', fontWeight: 600 }}>{receiptData.pan?.startsWith('4') ? 'VISA' : receiptData.pan?.startsWith('5') ? 'MASTERCARD' : 'LOCAL CARD'}</div>
                <div>Số thẻ:</div><div style={{ textAlign: 'right', fontWeight: 600 }}>**** **** **** {receiptData.pan?.slice(-4) || '****'}</div>
                <div>Cardholder:</div><div style={{ textAlign: 'right', fontWeight: 600 }}>NGUYEN VAN A</div>
                <div>Ngân hàng phát hành:</div><div style={{ textAlign: 'right', fontWeight: 600 }}>BKBank</div>
              </div>
              <div style={{ marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>STAN:</span> <span style={{ fontWeight: 600 }}>{receiptData.stan || 'N/A'}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>RRN:</span> <span style={{ fontWeight: 600 }}>{Math.floor(100000000000 + Math.random() * 900000000000)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Approval Code:</span> <span style={{ fontWeight: 600 }}>{status === 'APPROVED' ? Math.floor(100000 + Math.random() * 900000) : 'N/A'}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Response Code:</span> <span style={{ fontWeight: 600 }}>{receiptData.code}</span></div>
              </div>

              <div style={{ borderTop: '1px dashed #94a3b8', margin: '0.5rem 0' }}></div>

              {/* Amounts */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.25rem', marginTop: '0.5rem' }}>
                <div>Tạm tính:</div><div style={{ textAlign: 'right' }}>{Number(receiptData.amount).toLocaleString('vi-VN')} VND</div>
                <div>Thuế (VAT 0%):</div><div style={{ textAlign: 'right' }}>0 VND</div>
              </div>

              <div style={{ borderTop: '1px solid #1e293b', margin: '0.5rem 0' }}></div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 700, fontSize: '1rem' }}>
                <div>TỔNG THANH TOÁN:</div>
                <div>{Number(receiptData.amount).toLocaleString('vi-VN')} VND</div>
              </div>

              <div style={{ borderTop: '1px solid #1e293b', margin: '0.5rem 0' }}></div>

              {/* Status & Footer */}
              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <div style={{ fontWeight: 700, fontSize: '1.125rem', marginBottom: '1.5rem' }}>Trạng thái: {status}</div>

                <div style={{ marginBottom: '3rem' }}>Chữ ký khách hàng:</div>
                <div style={{ borderBottom: '1px solid #94a3b8', width: '80%', margin: '0 auto 1rem auto' }}></div>

                <div style={{ fontSize: '0.75rem', fontStyle: 'italic', marginBottom: '1rem', color: '#64748b' }}>
                  Tôi đồng ý thanh toán số tiền trên<br />theo điều khoản của ngân hàng phát hành thẻ.
                </div>

                <div style={{ borderTop: '1px dashed #94a3b8', margin: '0.5rem 0' }}></div>
                <div style={{ fontWeight: 600 }}>Cảm ơn Quý khách!</div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
