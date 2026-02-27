'use client';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard, faCheckCircle, faTimesCircle, faArrowLeft, faStore, faWifi, faPrint } from '@fortawesome/free-solid-svg-icons';

export default function PosSimulator() {
  const [amount, setAmount] = useState('0');
  const [pan, setPan] = useState('9999888877776666'); // Default to a valid PAN length 16
  const [merchantId, setMerchantId] = useState('POS-BK-001');

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
          merchantName: 'BK POS Demo'
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

          {/* Receipt Slide-up Animation */}
          {(status === 'APPROVED' || status === 'DECLINED') && receiptData && (
            <div className="receipt-wrapper">
              <div className="receipt">
                <div style={{ textAlign: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1rem' }}>
                  <FontAwesomeIcon icon={faPrint} style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }} />
                  <div style={{ fontWeight: 700, fontSize: '1.25rem' }}>BKBank POS</div>
                  <div style={{ fontSize: '0.875rem' }}>Hóa đơn điện tử</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.5rem', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                  <div style={{ color: '#64748b' }}>Ngày:</div>
                  <div style={{ fontWeight: 600 }}>{new Date().toLocaleString()}</div>

                  <div style={{ color: '#64748b' }}>Mã chuẩn chi (STAN):</div>
                  <div style={{ fontWeight: 600 }}>{receiptData.stan || 'N/A'}</div>

                  <div style={{ color: '#64748b' }}>Thẻ số:</div>
                  <div style={{ fontWeight: 600, fontFamily: 'monospace' }}>**** {receiptData.pan?.slice(-4) || '****'}</div>

                  <div style={{ color: '#64748b' }}>Mã phản hồi:</div>
                  <div style={{ fontWeight: 600 }}>{receiptData.code}</div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 700, fontSize: '1.25rem', borderTop: '2px dashed #cbd5e1', paddingTop: '1rem' }}>
                  <div>TỔNG TIỀN:</div>
                  <div>$ {Number(receiptData.amount).toLocaleString('en-US')}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Số Thẻ Khách Hàng (Mô phỏng)</label>
            <input
              type="text"
              value={pan}
              onChange={(e) => setPan(e.target.value)}
              style={{
                width: '100%', padding: '0.75rem 1rem', borderRadius: '8px',
                background: 'rgba(0,0,0,0.2)', border: '1px solid var(--pos-border)', color: 'white', fontFamily: 'monospace', fontSize: '1rem'
              }}
              disabled={status === 'PROCESSING'}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem' }}>&nbsp;</label>
            {(status === 'APPROVED' || status === 'DECLINED' || status === 'ERROR') && (
              <button onClick={handleReset} className="numpad-btn" style={{ background: '#475569', width: '120px', height: '44px', fontSize: '1rem' }}>
                <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '0.5rem' }} /> Trở lại
              </button>
            )}
          </div>
        </div>

        {/* Numpad */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', opacity: status !== 'IDLE' && status !== 'ERROR' ? 0.5 : 1, pointerEvents: status !== 'IDLE' && status !== 'ERROR' ? 'none' : 'auto' }}>
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

      </div>
    </div>
  );
}
