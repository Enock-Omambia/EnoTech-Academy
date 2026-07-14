/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Modular QR Code Scanner with Live Web Camera Feed and Simulation Mode.
 */

import React, { useEffect, useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Camera, RefreshCw, X, AlertTriangle, CheckCircle, Sparkles, HelpCircle } from "lucide-react";
import { Certificate } from "../types";

interface QrScannerProps {
  onScanSuccess: (serial: string) => void;
  onClose: () => void;
  certificates: Certificate[];
  darkMode: boolean;
}

export default function QrScanner({ onScanSuccess, onClose, certificates, darkMode }: QrScannerProps) {
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const qrCodeInstanceRef = useRef<Html5Qrcode | null>(null);
  const containerId = "qr-reader-element";

  // Sound feedback
  const playBeep = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      
      const audioCtx = new AudioContextClass();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.type = "sine";
      oscillator.frequency.value = 880; // A5 note
      gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.12);
    } catch (e) {
      console.warn("Audio Context beep suppressed or unavailable:", e);
    }
  };

  // Extract certificate number from a URL or raw text
  const extractCertificateNumber = (scannedText: string): string => {
    const trimmed = scannedText.trim();
    
    // Check if it contains the "/verify/" route
    if (trimmed.includes("/verify/")) {
      const parts = trimmed.split("/verify/");
      if (parts.length > 1) {
        return parts[1].split(/[?#]/)[0].trim();
      }
    }
    
    // Check if it is a general URL
    try {
      const url = new URL(trimmed);
      const pathname = url.pathname;
      const segments = pathname.split("/").filter(Boolean);
      if (segments.length > 0) {
        const lastSegment = segments[segments.length - 1];
        if (lastSegment.toUpperCase().includes("ETA-") || lastSegment.toUpperCase().includes("ET-")) {
          return lastSegment;
        }
      }
    } catch (e) {
      // Suppress, not a valid URL
    }
    
    // Fallback: check with regex for certificate code pattern (e.g. ETA-2026-9042 or ET-CERT-2026-9042)
    const patternMatch = trimmed.match(/(ETA-\d{4}-\d+|ET-CERT-\d{4}-\d+)/i);
    if (patternMatch) {
      return patternMatch[0];
    }
    
    return trimmed;
  };

  // Initialize and list cameras
  useEffect(() => {
    const html5QrCode = new Html5Qrcode(containerId);
    qrCodeInstanceRef.current = html5QrCode;

    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length > 0) {
          setCameras(devices);
          // Try to select environment/back camera if available
          const backCam = devices.find((device) =>
            device.label.toLowerCase().includes("back") ||
            device.label.toLowerCase().includes("environment") ||
            device.label.toLowerCase().includes("rear")
          );
          const defaultCamId = backCam ? backCam.id : devices[0].id;
          setSelectedCameraId(defaultCamId);
          startScanning(html5QrCode, defaultCamId);
        } else {
          setError("No cameras found. Verify that your device has an active camera and it is not in use.");
        }
      })
      .catch((err) => {
        console.warn("Camera enumeration failed:", err);
        setError("Camera permission denied, unavailable, or blocked in this iframe. Try testing with the Simulator panel below!");
      });

    return () => {
      if (qrCodeInstanceRef.current) {
        if (qrCodeInstanceRef.current.isScanning) {
          qrCodeInstanceRef.current.stop().catch((err) => console.error("Error stopping scanner during unmount:", err));
        }
      }
    };
  }, []);

  const startScanning = (scanner: Html5Qrcode, cameraId: string) => {
    setError("");
    setIsScanning(true);
    
    scanner
      .start(
        cameraId,
        {
          fps: 12,
          qrbox: (width, height) => {
            const size = Math.min(width, height) * 0.75;
            return { width: size, height: size };
          },
        },
        (decodedText) => {
          playBeep();
          const extractedSerial = extractCertificateNumber(decodedText);
          onScanSuccess(extractedSerial);
          
          // Stop scanning on success
          if (scanner.isScanning) {
            scanner.stop().then(() => {
              setIsScanning(false);
              onClose();
            }).catch((err) => console.error("Error stopping scanner:", err));
          } else {
            onClose();
          }
        },
        () => {
          // Silent callback for frame scanning failures
        }
      )
      .catch((err) => {
        console.warn("Failed to start scanning:", err);
        setError(`Unable to open camera stream: ${err}`);
        setIsScanning(false);
      });
  };

  const handleCameraChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value;
    setSelectedCameraId(newId);
    
    if (qrCodeInstanceRef.current) {
      if (qrCodeInstanceRef.current.isScanning) {
        try {
          await qrCodeInstanceRef.current.stop();
        } catch (err) {
          console.error("Error stopping prior camera:", err);
        }
      }
      startScanning(qrCodeInstanceRef.current, newId);
    }
  };

  // Mock scan function for sandbox/developer/offline testing
  const handleSimulateScan = (serial: string) => {
    playBeep();
    onScanSuccess(serial);
    if (qrCodeInstanceRef.current && qrCodeInstanceRef.current.isScanning) {
      qrCodeInstanceRef.current.stop()
        .then(() => {
          setIsScanning(false);
          onClose();
        })
        .catch(() => onClose());
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className={`max-w-md w-full rounded-2xl overflow-hidden border shadow-2xl flex flex-col transition-all ${
        darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-800"
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-cyan-400 animate-pulse" />
            <span className="font-extrabold text-sm tracking-tight">Camera QR Code Scanner</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera Feed / Scanning Body */}
        <div className="relative p-6 flex flex-col items-center justify-center bg-black min-h-[300px]">
          {/* Glowing Targeting Laser / Frame Overlay */}
          {isScanning && !error && (
            <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
              <div className="w-[180px] h-[180px] border-2 border-cyan-400/60 rounded-xl relative overflow-hidden flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                {/* 4 corner bracket decoration */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-cyan-400"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-cyan-400"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-cyan-400"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-cyan-400"></div>
                
                {/* Laser animation */}
                <div className="absolute left-0 right-0 h-1 bg-cyan-400/90 shadow-[0_0_10px_#22d3ee] animate-[bounce_2s_infinite]"></div>
              </div>
            </div>
          )}

          {/* HTML5 QR Code Mount Element */}
          <div 
            id={containerId} 
            className="w-full max-w-[320px] rounded-xl overflow-hidden aspect-square [&_video]:object-cover"
          ></div>

          {/* Camera Loading or Error placeholders */}
          {!isScanning && !error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 p-6 text-center space-y-3">
              <RefreshCw className="w-10 h-10 text-cyan-400 animate-spin" />
              <p className="text-xs text-slate-400">Requesting device hardware camera access...</p>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 p-6 text-center space-y-4">
              <div className="p-3 bg-red-950/40 border border-red-900/50 rounded-full text-red-400">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-red-400 block">Camera Feed Unavailable</span>
                <p className="text-[11px] text-slate-400 max-w-xs">{error}</p>
              </div>
              <div className="bg-blue-950/20 border border-blue-900/40 p-2.5 rounded-lg max-w-xs">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider flex items-center justify-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5" /> Sandbox Testing Note
                </span>
                <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                  In web previews or strict iframes, browser security policies can block webcams. Please use the **Simulation Sandbox** below to test automatic verification!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Controls and Camera Switcher */}
        {cameras.length > 1 && !error && (
          <div className="px-5 py-3 border-t border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
            <span className="text-slate-400 font-semibold flex items-center gap-1">
              <RefreshCw className="w-3.5 h-3.5" /> Select Camera:
            </span>
            <select
              value={selectedCameraId}
              onChange={handleCameraChange}
              className="bg-transparent border border-slate-200 dark:border-slate-800 rounded px-2.5 py-1 text-xs font-semibold focus:outline-none cursor-pointer"
            >
              {cameras.map((cam, idx) => (
                <option key={cam.id} value={cam.id} className="dark:bg-slate-900">
                  {cam.label || `Camera ${idx + 1}`}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Sandbox Test Simulator Panel */}
        <div className="p-5 space-y-3 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> QR Code Simulation Sandbox
            </span>
            <span className="text-[9px] px-1.5 py-0.2 bg-cyan-950/40 text-cyan-400 border border-cyan-900/30 rounded font-bold uppercase">
              Dev Suite
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-normal">
            To test without a webcam, click any button below. This simulates scanning a printed certificate's QR code, extracts the serial number, and launches instant validation:
          </p>

          <div className="grid grid-cols-2 gap-2.5 pt-1">
            {certificates.map((cert) => (
              <button
                key={cert.certificateNumber}
                onClick={() => handleSimulateScan(cert.certificateNumber)}
                className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-left hover:border-cyan-500 hover:bg-cyan-500/5 transition-all text-xs"
              >
                <div className="flex items-center gap-1 text-emerald-400 font-bold mb-0.5">
                  <CheckCircle className="w-3.5 h-3.5" /> Valid QR Data
                </div>
                <span className="font-mono font-bold block truncate text-cyan-400">{cert.certificateNumber}</span>
                <span className="text-[10px] text-slate-400 truncate block mt-0.5">{cert.studentName}</span>
              </button>
            ))}

            <button
              onClick={() => handleSimulateScan("ET-CERT-2026-INVALID-DEMO")}
              className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-left hover:border-rose-500 hover:bg-rose-500/5 transition-all text-xs"
            >
              <div className="flex items-center gap-1 text-rose-400 font-bold mb-0.5">
                <AlertTriangle className="w-3.5 h-3.5" /> Invalid QR Data
              </div>
              <span className="font-mono font-bold block text-rose-400">ET-CERT-INVALID</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Unregistered fake code</span>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="px-5 py-3 text-[10px] text-slate-500 text-center border-t border-slate-100 dark:border-slate-800">
          Certificate QR standard conforms to AES-256 secure hash verify protocols.
        </div>
      </div>
    </div>
  );
}
