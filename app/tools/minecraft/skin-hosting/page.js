'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, Check, AlertCircle } from 'lucide-react';
import Header from '/app/header.js';
import Footer from '/app/footer.js';
import { supabase } from '/lib/supabase.js';

const SKIN_HOST = 'https://shiroharu.eu.org';

export default function SkinHostingPage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [recentSkins, setRecentSkins] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchRecentSkins = async () => {
      const { data } = await supabase
        .from('skins')
        .select('*')
        .order('uploaded_at', { ascending: false })
        .limit(16);

      setRecentSkins(data || []);
    };
    fetchRecentSkins();
  }, []);

  const validateAndSetFile = (selectedFile) => {
    if (!selectedFile) return;

    if (selectedFile.size > 16384) {
      setUploadStatus({ type: 'error', message: 'File too large (max 16 KB)' });
      return;
    }

    if (selectedFile.type !== 'image/png') {
      setUploadStatus({ type: 'error', message: 'Only PNG files are allowed' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        if (img.width !== 64 || img.height !== 64) {
          setUploadStatus({ type: 'error', message: 'Skin must be exactly 64x64 pixels' });
          setFile(null);
          setPreview(null);
          return;
        }

        setFile(selectedFile);
        setPreview(event.target.result);
        setUploadStatus(null);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleFileSelect = (event) => {
    validateAndSetFile(event.target.files?.[0]);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  };

  const refreshRecentSkins = async () => {
    const { data } = await supabase
      .from('skins')
      .select('*')
      .order('uploaded_at', { ascending: false })
      .limit(16);
    setRecentSkins(data || []);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const checksum = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('').substring(0, 16);

      const { data: existingFile } = await supabase
        .from('skins')
        .select('*')
        .eq('checksum', checksum)
        .single();

      if (existingFile) {
        setUploadStatus({
          type: 'success',
          message: 'This skin already exists in the database! No new upload was made.',
        });
        setUploadedUrl(`${SKIN_HOST}/api/skins/${checksum}.png`);
        setFile(null);
        setPreview(null);
        setUploading(false);
        return;
      }

      const fileName = `${checksum}.png`;
      const { error: uploadError } = await supabase.storage
        .from('skins')
        .upload(fileName, file, { cacheControl: '3600', upsert: false });

      if (uploadError) {
        setUploadStatus({ type: 'error', message: `Storage error: ${uploadError.message}` });
        setUploading(false);
        return;
      }

      const { error: dbError } = await supabase
        .from('skins')
        .insert([{
          checksum,
          file_url: supabase.storage.from('skins').getPublicUrl(fileName).data.publicUrl,
          uploaded_at: new Date().toISOString(),
        }]);

      if (dbError) {
        setUploadStatus({ type: 'error', message: `Database error: ${dbError.message}` });
        setUploading(false);
        return;
      }

      setUploadedUrl(`${SKIN_HOST}/api/skins/${checksum}.png`);
      setUploadStatus({ type: 'success', message: 'Skin uploaded successfully! Save the URL somewhere safe.' });
      setFile(null);
      setPreview(null);
      await refreshRecentSkins();
    } catch (error) {
      setUploadStatus({ type: 'error', message: error.message });
    }

    setUploading(false);
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(uploadedUrl);
    setUploadStatus({ type: 'success', message: 'URL copied to clipboard!' });
  };

  return (
    <main className="tool-page">
      <div className="bg-grid" />
      <Header />
      <section className="tool-hero">
        <div className="wrap">
          <div className="eyebrow">Minecraft</div>
          <h1>Minecraft Skin Hosting</h1>
          <p className="lede">
            Sharing your Minecraft skin, made really simple. No signup required, ad-free forever.
          </p>
        </div>
      </section>

      <section className="wrap tool-card">
        <div className="tool-panel">
          {preview && (
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
              <div
                style={{
                  display: 'inline-block',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: '2px solid var(--cyan)',
                  boxShadow: '0 0 30px rgba(112, 178, 166, 0.4)',
                }}
              >
                <img
                  src={preview}
                  alt="Skin preview"
                  style={{ width: '220px', height: '220px', imageRendering: 'pixelated', display: 'block' }}
                />
              </div>
              <div style={{ fontSize: '13px', color: 'var(--cyan)', marginTop: '1rem', fontWeight: 500 }}>
                ✓ Perfect! Ready to upload.
              </div>
            </div>
          )}

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${dragActive ? 'var(--cyan)' : 'var(--line)'}`,
              borderRadius: '10px',
              padding: '3rem 2rem',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
              boxShadow: dragActive ? '0 0 30px rgba(112, 178, 166, 0.35)' : 'none',
              marginBottom: '1.5rem',
              background: 'rgba(112, 178, 166, 0.04)',
            }}
          >
            <Upload style={{ width: '36px', height: '36px', margin: '0 auto 1rem', color: 'var(--cyan)' }} />
            <div style={{ fontSize: '17px', fontWeight: 600, marginBottom: '0.5rem' }}>
              Upload your Minecraft skin here
            </div>
            <div style={{ fontSize: '14px', color: 'var(--muted)' }}>
              Drag and drop or click to select
            </div>
            <div className="mono" style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '1rem' }}>
              Must be 64x64 PNG format, max 16 KB
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
          </div>

          {uploadStatus && (
            <div
              className={uploadStatus.type === 'error' ? 'tool-error' : ''}
              style={
                uploadStatus.type === 'error'
                  ? { display: 'flex', gap: '10px', alignItems: 'center' }
                  : {
                      display: 'flex',
                      gap: '10px',
                      alignItems: 'center',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      marginTop: '16px',
                      background: 'rgba(112, 178, 166, 0.1)',
                      border: '1px solid rgba(112, 178, 166, 0.35)',
                      color: 'var(--cyan)',
                      fontSize: '13px',
                      fontWeight: 500,
                    }
              }
            >
              {uploadStatus.type === 'error' ? (
                <AlertCircle style={{ width: '16px', height: '16px', flexShrink: 0 }} />
              ) : (
                <Check style={{ width: '16px', height: '16px', flexShrink: 0 }} />
              )}
              {uploadStatus.message}
            </div>
          )}

          {uploadedUrl && (
            <div
              style={{
                background: 'rgba(112, 178, 166, 0.1)',
                border: '1px solid rgba(112, 178, 166, 0.35)',
                borderRadius: '10px',
                padding: '1rem',
                marginTop: '16px',
              }}
            >
              <div className="mono" style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Your skin URL
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div
                  className="mono"
                  style={{
                    flex: 1,
                    background: 'rgba(7, 7, 13, 0.55)',
                    padding: '12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    wordBreak: 'break-all',
                    color: 'var(--cyan)',
                    border: '1px solid var(--line)',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {uploadedUrl}
                </div>
                <button onClick={copyUrl} className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
                  Copy
                </button>
              </div>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '20px', justifyContent: 'center', opacity: !file || uploading ? 0.5 : 1, cursor: !file || uploading ? 'not-allowed' : 'pointer' }}
          >
            {uploading ? 'Uploading...' : 'Upload Skin'}
          </button>
        </div>

        {recentSkins.length > 0 && (
          <div style={{ marginTop: '48px' }}>
            <div className="section-label">Recently Uploaded</div>
            <div className="skin-grid">
              {recentSkins.map((skin) => (
                <div key={skin.checksum} className="skin-card">
                  <img src={`${SKIN_HOST}/api/skins/${skin.checksum}.png`} alt={skin.checksum} loading="lazy" onError={(e) => { e.currentTarget.src = '/b598a7a97ce12c91.png'; }} />
                  <div className="checksum mono">{skin.checksum}</div>
                  <div className="date">{new Date(skin.uploaded_at).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
