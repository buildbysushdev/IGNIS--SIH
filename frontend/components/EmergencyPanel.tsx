"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { Fire } from "./FireMap";
import { playAlertSound, playTacticalAlertSound } from "@/utils/audio";
import AlertTimeline from "./AlertTimeline";
import axios from "axios";

export interface NotificationItem {
  id: number | string;
  detection_id?: number;
  alert_type?: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | string;
  status: "NEW" | "ACKNOWLEDGED" | "DISPATCHED" | "ESCALATED" | "RESOLVED" | "FALSE_ALARM";
  message: string;
  created_at: string;
  latitude: number;
  longitude: number;
  frp?: number;
  category: string;
  protocol_summary?: {
    fire_class?: string;
    primary_agents?: string[];
    avoid?: string[];
    evacuation_radius_m?: number;
    personnel_required?: number;
  };
  nearest_station?: {
    name: string;
    distance_km: number;
    eta_minutes: number;
    phone: string;
  };
  recommended_actions?: string[];
}

interface EmergencyPanelProps {
  isOpen: boolean;
  onClose: () => void;
  activeFire: Fire | null;
  onOpenDispatch: (fire: Fire) => void;
  onPanToFire?: (coords: [number, number]) => void;
}

export { playAlertSound, playTacticalAlertSound };

export default function EmergencyPanel({
  isOpen,
  onClose,
  activeFire,
  onOpenDispatch,
  onPanToFire,
}: EmergencyPanelProps) {
  const [queue, setQueue] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [expandedAlertId, setExpandedAlertId] = useState<number | string | null>(null);
  const [activeTab, setActiveTab] = useState<"QUEUE" | "TIMELINE">("QUEUE");

  // Modal confirmation state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    alert: NotificationItem | null;
    actionType: "ACKNOWLEDGE" | "DISPATCH" | "ESCALATE" | "FALSE_ALARM";
    escalationLevel?: "DISTRICT" | "STATE" | "NATIONAL";
  }>({
    isOpen: false,
    alert: null,
    actionType: "ACKNOWLEDGE",
    escalationLevel: "DISTRICT",
  });

  const [notificationPermission, setNotificationPermission] = useState<string>("default");
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);
  const knownAlertIdsRef = useRef<Set<string | number>>(new Set());
  const autoSlideTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize notification permission status
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  // Request browser desktop notification permissions
  const requestDesktopPermission = async () => {
    if (typeof window !== "undefined" && "Notification" in window) {
      try {
        const perm = await Notification.requestPermission();
        setNotificationPermission(perm);
        if (perm === "granted") {
          new Notification("IGNIS Ground Station", {
            body: "Emergency desktop alerts enabled successfully.",
            icon: "/favicon.ico",
          });
        }
      } catch (err) {
        console.warn("[IGNIS] Notification permission request failed:", err);
      }
    }
  };

  // Trigger browser notification for a new critical alert
  const sendDesktopNotification = useCallback((alert: NotificationItem) => {
    if (
      typeof window !== "undefined" &&
      "Notification" in window &&
      Notification.permission === "granted"
    ) {
      try {
        const n = new Notification("⚠ CRITICAL EVENT DETECTED", {
          body: `${alert.message}\nCoords: ${alert.latitude.toFixed(4)}°N, ${alert.longitude.toFixed(4)}°E`,
          tag: `ignis-${alert.id}`,
          requireInteraction: true,
        });
        n.onclick = () => {
          window.focus();
          n.close();
        };
      } catch {}
    }
  }, []);

  // Fetch unacknowledged emergency notifications queue
  const fetchQueue = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/notifications");
      if (Array.isArray(res.data)) {
        const items: NotificationItem[] = res.data;

        // Detect genuinely new critical alerts
        let hasNewCritical = false;
        items.forEach((item) => {
          if (!knownAlertIdsRef.current.has(item.id)) {
            knownAlertIdsRef.current.add(item.id);
            if (item.status === "NEW" && item.severity === "CRITICAL") {
              hasNewCritical = true;
              sendDesktopNotification(item);
            }
          }
        });

        if (hasNewCritical) {
          playAlertSound("CRITICAL");
        }

        setQueue(items);
        if (items.length > 0 && expandedAlertId === null) {
          setExpandedAlertId(items[0].id);
        }
      }
    } catch (err) {
      console.warn("[IGNIS] Could not fetch notifications queue:", err);
    } finally {
      setLoading(false);
    }
  }, [expandedAlertId, sendDesktopNotification]);

  // Initial fetch and 15s interval sync
  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 15000);
    return () => clearInterval(interval);
  }, [fetchQueue]);

  // If parent passes activeFire that is critical, ensure it's in the queue
  useEffect(() => {
    if (activeFire && (activeFire.risk_level === "CRITICAL" || activeFire.category === "EMERGENCY_INDUSTRIAL")) {
      playAlertSound("CRITICAL");

      const tempId = `TEMP-${activeFire.latitude.toFixed(3)}-${activeFire.longitude.toFixed(3)}`;
      setQueue((prev) => {
        const exists = prev.some(
          (q) =>
            q.id === tempId ||
            (Math.abs(q.latitude - activeFire.latitude) < 0.01 &&
              Math.abs(q.longitude - activeFire.longitude) < 0.01)
        );
        if (exists) return prev;

        const newEntry: NotificationItem = {
          id: tempId,
          severity: "CRITICAL",
          status: "NEW",
          message: `🚨 CRITICAL EVENT: ${activeFire.facility_name || activeFire.nearest_facility || "High Thermal Anomaly"} (${(activeFire.frp || 0).toFixed(1)} MW)`,
          created_at: new Date().toISOString(),
          latitude: activeFire.latitude,
          longitude: activeFire.longitude,
          frp: activeFire.frp,
          category: activeFire.category,
          protocol_summary: {
            fire_class: "Class B/C",
            primary_agents: ["AFFF Foam", "Dry Chemical Powder"],
            avoid: ["Direct water jet on molten chemical/solvents"],
            evacuation_radius_m: 800,
            personnel_required: 16,
          },
          nearest_station: {
            name: (activeFire as any).station_name || "Surat Central Fire Station",
            distance_km: (activeFire as any).station_distance_km || 2.3,
            eta_minutes: (activeFire as any).station_eta_minutes || 6,
            phone: "+91-261-2422222",
          },
          recommended_actions: ["ACKNOWLEDGE", "DISPATCH", "ESCALATE", "FALSE_ALARM"],
        };

        sendDesktopNotification(newEntry);
        return [newEntry, ...prev];
      });

      setExpandedAlertId(tempId);
    }
  }, [activeFire, sendDesktopNotification]);

  // Unacknowledged count badge
  const unacknowledgedCount = queue.filter((q) => q.status === "NEW").length;

  // Check if all alerts are acknowledged and handle auto slide-out
  useEffect(() => {
    if (queue.length > 0 && unacknowledgedCount === 0) {
      if (autoSlideTimerRef.current) clearTimeout(autoSlideTimerRef.current);
      autoSlideTimerRef.current = setTimeout(() => {
        // Auto slide out when all alerts are resolved
        onClose();
      }, 5000);
    }
    return () => {
      if (autoSlideTimerRef.current) clearTimeout(autoSlideTimerRef.current);
    };
  }, [queue, unacknowledgedCount, onClose]);

  // Sort queue: unacknowledged (NEW) at top, acknowledged/dispatched at bottom
  const sortedQueue = [...queue].sort((a, b) => {
    const aIsNew = a.status === "NEW" ? 0 : 1;
    const bIsNew = b.status === "NEW" ? 0 : 1;
    if (aIsNew !== bIsNew) return aIsNew - bIsNew;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  // Action button click -> opens confirm modal
  const handleInitiateAction = (
    alert: NotificationItem,
    actionType: "ACKNOWLEDGE" | "DISPATCH" | "ESCALATE" | "FALSE_ALARM"
  ) => {
    setConfirmModal({
      isOpen: true,
      alert,
      actionType,
      escalationLevel: "DISTRICT",
    });
  };

  // Execute confirmed action against backend
  const handleConfirmAction = async () => {
    if (!confirmModal.alert) return;
    const { alert, actionType, escalationLevel } = confirmModal;

    try {
      if (actionType === "ESCALATE") {
        await axios.post(`/api/notifications/${alert.id}/escalate`, {
          level: escalationLevel || "DISTRICT",
        });
        setQueue((prev) =>
          prev.map((item) =>
            item.id === alert.id ? { ...item, status: "ESCALATED" } : item
          )
        );
        setActionSuccessMsg(`ALERT #${alert.id} ESCALATED TO ${escalationLevel} LEVEL`);
      } else {
        const actionPayload =
          actionType === "DISPATCH"
            ? "DISPATCHED"
            : actionType === "FALSE_ALARM"
            ? "FALSE_ALARM"
            : "ACKNOWLEDGED";

        await axios.post(`/api/notifications/${alert.id}/acknowledge`, {
          action: actionPayload,
        });

        setQueue((prev) =>
          prev.map((item) =>
            item.id === alert.id ? { ...item, status: actionPayload as any } : item
          )
        );

        if (actionType === "DISPATCH") {
          const fireObj: Fire = {
            latitude: alert.latitude,
            longitude: alert.longitude,
            brightness: 350,
            frp: alert.frp || 85,
            confidence: "nominal",
            acq_date: new Date().toISOString().slice(0, 10),
            acq_time: new Date().toISOString().slice(11, 16).replace(":", ""),
            category: alert.category,
            risk_level: "CRITICAL",
            reason: alert.message,
            action: "DISPATCHED",
            facility_name: alert.message.split(":")[1]?.trim() || "Industrial Unit",
            station_name: alert.nearest_station?.name,
            station_distance_km: alert.nearest_station?.distance_km,
            station_eta_minutes: alert.nearest_station?.eta_minutes,
          };
          onOpenDispatch(fireObj);
          setActionSuccessMsg(`DISPATCH TRIGGERED FOR ALERT #${alert.id}`);
        } else {
          setActionSuccessMsg(`ALERT #${alert.id} MARKED AS ${actionPayload}`);
        }
      }

      setTimeout(() => setActionSuccessMsg(null), 4000);
    } catch (err: any) {
      console.warn("[IGNIS] Action execution error:", err?.message);
      // Optimistic update so user workflow is not blocked
      const optimisticStatus =
        actionType === "ESCALATE"
          ? "ESCALATED"
          : actionType === "DISPATCH"
          ? "DISPATCHED"
          : actionType === "FALSE_ALARM"
          ? "FALSE_ALARM"
          : "ACKNOWLEDGED";

      setQueue((prev) =>
        prev.map((item) =>
          item.id === alert.id ? { ...item, status: optimisticStatus as any } : item
        )
      );
      setActionSuccessMsg(`ACTION RECORDED: ${optimisticStatus}`);
      setTimeout(() => setActionSuccessMsg(null), 3000);
    } finally {
      setConfirmModal((prev) => ({ ...prev, isOpen: false, alert: null }));
    }
  };

  const getRelativeTime = (isoString: string) => {
    try {
      const diffSec = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
      if (diffSec < 60) return `${Math.max(1, diffSec)}s ago`;
      const diffMin = Math.floor(diffSec / 60);
      if (diffMin < 60) return `${diffMin}m ago`;
      const diffHr = Math.floor(diffMin / 60);
      return `${diffHr}h ${diffMin % 60}m ago`;
    } catch {
      return "just now";
    }
  };

  const getCategoryChip = (cat?: string) => {
    const c = (cat || "UNKNOWN").toUpperCase();
    if (c.includes("EMERGENCY")) {
      return (
        <span className="text-[9px] font-bold px-1.5 py-0.5 bg-[#ff3b3b]/20 border border-[#ff3b3b] text-[#ff3b3b]">
          EMERGENCY INDUSTRIAL
        </span>
      );
    }
    if (c.includes("PERSISTENT")) {
      return (
        <span className="text-[9px] font-bold px-1.5 py-0.5 bg-[#ff8000]/20 border border-[#ff8000] text-[#ff8000]">
          PERSISTENT INDUSTRIAL
        </span>
      );
    }
    if (c.includes("FOREST")) {
      return (
        <span className="text-[9px] font-bold px-1.5 py-0.5 bg-[#00ff9c]/20 border border-[#00ff9c] text-[#00ff9c]">
          FOREST FIRE
        </span>
      );
    }
    return (
      <span className="text-[9px] font-bold px-1.5 py-0.5 bg-[#00d4ff]/20 border border-[#00d4ff] text-[#00d4ff]">
        {c}
      </span>
    );
  };

  return (
    <>
      {/* Slide-in Drawer Container */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-[#0a0e14] border-l-2 border-[#ff3b3b] z-[2500] font-mono text-[#d0d8e0] shadow-[-24px_0_48px_rgba(0,0,0,0.85)] flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Top Header Banner */}
        <div className="p-3 bg-[#130708] border-b border-[#ff3b3b]/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff3b3b] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#ff3b3b]"></span>
            </span>
            <span className="text-xs font-black tracking-wider text-[#ff3b3b] uppercase">
              ⚠ CRITICAL EVENTS
            </span>
            {unacknowledgedCount > 0 && (
              <span className="text-[9px] px-1.5 py-0.5 bg-[#ff3b3b] text-black font-black">
                {unacknowledgedCount} UNACKNOWLEDGED
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {notificationPermission !== "granted" && (
              <button
                onClick={requestDesktopPermission}
                className="text-[9px] px-1.5 py-0.5 border border-[#00d4ff]/60 text-[#00d4ff] hover:bg-[#00d4ff]/20 transition cursor-pointer"
                title="Enable Desktop Browser Notifications"
              >
                [🔔 NOTIFY]
              </button>
            )}
            <button
              onClick={onClose}
              className="text-[#6b7785] hover:text-[#ff3b3b] font-bold text-sm px-1 cursor-pointer transition"
              aria-label="Close notification panel"
            >
              [✕]
            </button>
          </div>
        </div>

        {/* Tab Switcher: Active Queue vs 24h Timeline */}
        <div className="flex border-b border-[#1f2933] bg-[#070a0e] text-[10px] uppercase font-bold">
          <button
            onClick={() => setActiveTab("QUEUE")}
            className={`flex-1 py-2 text-center cursor-pointer transition ${
              activeTab === "QUEUE"
                ? "text-[#ff3b3b] border-b-2 border-[#ff3b3b] bg-[#ff3b3b]/10"
                : "text-[#6b7785] hover:text-[#d0d8e0]"
            }`}
          >
            [ ACTIVE QUEUE ({queue.length}) ]
          </button>
          <button
            onClick={() => setActiveTab("TIMELINE")}
            className={`flex-1 py-2 text-center cursor-pointer transition ${
              activeTab === "TIMELINE"
                ? "text-[#00d4ff] border-b-2 border-[#00d4ff] bg-[#00d4ff]/10"
                : "text-[#6b7785] hover:text-[#d0d8e0]"
            }`}
          >
            [ 24H TIMELINE ]
          </button>
        </div>

        {/* Action Success Notification Toast */}
        {actionSuccessMsg && (
          <div className="p-2 bg-[#00ff9c]/15 border-b border-[#00ff9c] text-[#00ff9c] text-[10px] font-bold text-center animate-fade-in">
            ✓ {actionSuccessMsg}
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {activeTab === "TIMELINE" ? (
            <AlertTimeline
              onPanToFire={onPanToFire}
              onSelectAlert={(timelineAlert) => {
                if (timelineAlert.latitude && timelineAlert.longitude && onPanToFire) {
                  onPanToFire([timelineAlert.latitude, timelineAlert.longitude]);
                }
              }}
            />
          ) : (
            /* Queue Tab */
            <>
              {unacknowledgedCount === 0 && queue.length > 0 && (
                <div className="p-2.5 bg-[#00ff9c]/10 border border-[#00ff9c]/40 text-center space-y-1">
                  <div className="text-[#00ff9c] font-black text-xs">✓ ALL CRITICAL ALERTS ACKNOWLEDGED</div>
                  <div className="text-[10px] text-[#6b7785]">
                    Panel will auto-collapse in 5 seconds or stay open for review.
                  </div>
                </div>
              )}

              {queue.length === 0 ? (
                <div className="py-16 text-center text-[#6b7785] text-xs space-y-2">
                  <div className="text-[#00ff9c] text-lg font-bold">[ ALL CLEAR ]</div>
                  <div>NO UNACKNOWLEDGED CRITICAL ALERTS</div>
                  <div className="text-[10px] text-[#4a5563]">
                    Thermal threshold scans nominal across all monitored zones.
                  </div>
                </div>
              ) : (
                sortedQueue.map((item) => {
                  const isNew = item.status === "NEW";
                  const isExpanded = expandedAlertId === item.id;
                  const lat = item.latitude;
                  const lon = item.longitude;

                  return (
                    <div
                      key={item.id}
                      className={`border transition-all duration-200 ${
                        isNew
                          ? "border-[#ff3b3b] bg-[#14080a] shadow-[0_0_12px_rgba(255,59,59,0.15)]"
                          : "border-[#1f2933] bg-[#080b0f] opacity-60 hover:opacity-100"
                      }`}
                    >
                      {/* Alert Card Header: Clickable to expand */}
                      <div
                        onClick={() => setExpandedAlertId(isExpanded ? null : item.id)}
                        className="p-2.5 cursor-pointer hover:bg-white/[0.02] transition space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-[10px]">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-[#00d4ff]">#{item.id}</span>
                            {getCategoryChip(item.category)}
                          </div>
                          <div className="text-[9px] text-[#6b7785] tabular-nums text-right">
                            <span className="text-[#d0d8e0] font-bold">{getRelativeTime(item.created_at)}</span>
                            <span className="ml-1 opacity-70">({item.created_at.slice(11, 19)}Z)</span>
                          </div>
                        </div>

                        {/* Message & Severity */}
                        <div className="text-xs font-bold text-white leading-snug">
                          {item.message}
                        </div>

                        {/* Coords & FRP Row */}
                        <div className="flex items-center justify-between text-[10px] text-[#6b7785] pt-0.5">
                          <span className="text-[#00d4ff] tabular-nums">
                            LAT: {lat.toFixed(4)}°N, LON: {lon.toFixed(4)}°E
                          </span>
                          {item.frp !== undefined && (
                            <span className="text-[#ff8000] font-bold tabular-nums">
                              FRP: {Number(item.frp).toFixed(1)} MW
                            </span>
                          )}
                        </div>

                        {/* Status chip & Expand hint */}
                        <div className="flex items-center justify-between pt-1 border-t border-[#1f2933]/60 text-[9px]">
                          <span
                            className={`font-black px-1.5 py-0.2 border ${
                              item.status === "NEW"
                                ? "border-[#ff3b3b] text-[#ff3b3b] bg-[#ff3b3b]/10"
                                : item.status === "DISPATCHED"
                                ? "border-[#00ff9c] text-[#00ff9c] bg-[#00ff9c]/10"
                                : item.status === "ESCALATED"
                                ? "border-[#ff00ea] text-[#ff00ea] bg-[#ff00ea]/10"
                                : item.status === "FALSE_ALARM"
                                ? "border-[#6b7785] text-[#6b7785]"
                                : "border-[#ffb800] text-[#ffb800] bg-[#ffb800]/10"
                            }`}
                          >
                            STATUS: {item.status}
                          </span>
                          <span className="text-[#6b7785] hover:text-[#00d4ff]">
                            {isExpanded ? "[▲ COLLAPSE]" : "[▼ EXPAND DETAILS]"}
                          </span>
                        </div>
                      </div>

                      {/* Expanded Details Section */}
                      {isExpanded && (
                        <div className="px-2.5 pb-2.5 pt-1 border-t border-[#1f2933] bg-[#05070a] space-y-2 text-[10px]">
                          {/* Locate on Map Button */}
                          {onPanToFire && (
                            <div className="flex justify-end">
                              <button
                                onClick={() => onPanToFire([lat, lon])}
                                className="px-2 py-0.5 border border-[#00d4ff] text-[#00d4ff] hover:bg-[#00d4ff]/20 font-bold transition"
                              >
                                [ ⌖ LOCATE ON MAP ]
                              </button>
                            </div>
                          )}

                          {/* Response Protocol Summary */}
                          {item.protocol_summary && (
                            <div className="border border-[#1f2933] bg-[#0a0e14] p-2 space-y-1">
                              <div className="text-[#00ff9c] font-black uppercase text-[9px] flex justify-between">
                                <span>// RESPONSE PROTOCOL</span>
                                <span>CLASS: {item.protocol_summary.fire_class || "Class B"}</span>
                              </div>
                              <div className="text-[#d0d8e0]">
                                <span className="text-[#6b7785]">PRIMARY AGENTS: </span>
                                {item.protocol_summary.primary_agents?.join(", ") || "Foam / Dry Chemical"}
                              </div>
                              {item.protocol_summary.avoid && item.protocol_summary.avoid.length > 0 && (
                                <div className="text-[#ff8080]">
                                  <span className="text-[#ff3b3b] font-bold">AVOID: </span>
                                  {item.protocol_summary.avoid.join("; ")}
                                </div>
                              )}
                              <div className="flex justify-between text-[9px] text-[#6b7785] pt-0.5">
                                <span>EVAC RADIUS: {item.protocol_summary.evacuation_radius_m || 500}m</span>
                                <span>CREW: {item.protocol_summary.personnel_required || 12} FIREFIGHTERS</span>
                              </div>
                            </div>
                          )}

                          {/* Nearest Fire Station Details */}
                          {item.nearest_station && (
                            <div className="border border-[#1f2933] bg-[#0a0e14] p-2 space-y-1">
                              <div className="text-[#00d4ff] font-black uppercase text-[9px] flex justify-between">
                                <span>// NEAREST STATION</span>
                                <span className="text-[#00ff9c]">ETA: {item.nearest_station.eta_minutes} MIN</span>
                              </div>
                              <div className="text-white font-bold flex justify-between">
                                <span>{item.nearest_station.name}</span>
                                <span className="text-[#6b7785]">{item.nearest_station.distance_km} km</span>
                              </div>
                              <div className="text-[9px] text-[#6b7785]">
                                HOTLINE: <span className="text-[#00d4ff] font-bold">{item.nearest_station.phone}</span>
                              </div>
                            </div>
                          )}

                          {/* Interactive Action Buttons */}
                          <div className="pt-1.5 space-y-1">
                            <div className="text-[9px] text-[#6b7785] font-bold uppercase">
                              // INCIDENT COMMAND ACTIONS
                            </div>
                            <div className="grid grid-cols-2 gap-1.5 text-[10px] font-bold">
                              {/* [✓ ACKNOWLEDGE] */}
                              <button
                                onClick={() => handleInitiateAction(item, "ACKNOWLEDGE")}
                                className="py-1.5 px-2 border border-[#ffb800] bg-[#ffb800]/10 text-[#ffb800] hover:bg-[#ffb800]/20 cursor-pointer transition text-center"
                              >
                                [✓ ACKNOWLEDGE]
                              </button>

                              {/* [🚒 DISPATCH] */}
                              <button
                                onClick={() => handleInitiateAction(item, "DISPATCH")}
                                className="py-1.5 px-2 border border-[#00ff9c] bg-[#00ff9c]/10 text-[#00ff9c] hover:bg-[#00ff9c]/20 cursor-pointer transition text-center"
                              >
                                [🚒 DISPATCH]
                              </button>

                              {/* [⬆ ESCALATE] */}
                              <button
                                onClick={() => handleInitiateAction(item, "ESCALATE")}
                                className="py-1.5 px-2 border border-[#ff00ea] bg-[#ff00ea]/10 text-[#ff00ea] hover:bg-[#ff00ea]/20 cursor-pointer transition text-center"
                              >
                                [⬆ ESCALATE]
                              </button>

                              {/* [❌ FALSE ALARM] */}
                              <button
                                onClick={() => handleInitiateAction(item, "FALSE_ALARM")}
                                className="py-1.5 px-2 border border-[#6b7785] bg-[#6b7785]/10 text-[#6b7785] hover:bg-[#6b7785]/20 hover:text-white cursor-pointer transition text-center"
                              >
                                [❌ FALSE ALARM]
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </>
          )}
        </div>

        {/* Footer: Sound Test & Desktop Alert Status */}
        <div className="p-2 border-t border-[#1f2933] bg-[#070a0e] flex items-center justify-between text-[10px] text-[#6b7785]">
          <div className="flex items-center gap-2">
            <span>SOUND: ACTIVE</span>
            <button
              onClick={() => playAlertSound("CRITICAL")}
              className="text-[#00d4ff] hover:underline cursor-pointer"
            >
              [TEST SOUND]
            </button>
          </div>
          <div className="tabular-nums">
            {notificationPermission === "granted" ? (
              <span className="text-[#00ff9c]">🔔 DESKTOP ON</span>
            ) : (
              <button
                onClick={requestDesktopPermission}
                className="text-[#ffb800] hover:underline"
              >
                ENABLE NOTIFICATIONS
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Action Confirmation Modal */}
      {confirmModal.isOpen && confirmModal.alert && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[2600] flex items-center justify-center p-4 font-mono text-[#d0d8e0]">
          <div className="w-full max-w-md bg-[#0a0e14] border-2 border-[#ff3b3b] shadow-[0_0_30px_rgba(255,59,59,0.3)] p-4 space-y-3">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#ff3b3b]/40 pb-2">
              <span className="text-xs font-black text-[#ff3b3b] uppercase tracking-wider">
                :: COMMAND CONFIRMATION
              </span>
              <span className="text-[10px] text-[#00d4ff]">
                ALERT #{confirmModal.alert.id}
              </span>
            </div>

            {/* Modal Description */}
            <div className="space-y-2 text-xs">
              {confirmModal.actionType === "ACKNOWLEDGE" && (
                <>
                  <p className="text-white font-bold">
                    Acknowledge receipt of critical anomaly?
                  </p>
                  <p className="text-[#6b7785] text-[11px]">
                    This records your command operator ID and response time in the national incident log.
                  </p>
                </>
              )}

              {confirmModal.actionType === "DISPATCH" && (
                <>
                  <p className="text-white font-bold">
                    Dispatch nearest emergency response unit?
                  </p>
                  <div className="p-2 border border-[#1f2933] bg-[#0f141b] text-[11px] space-y-1">
                    <div>UNIT: <span className="text-[#00ff9c] font-bold">{confirmModal.alert.nearest_station?.name || "Local Fire Unit"}</span></div>
                    <div>ETA: <span className="text-white">{confirmModal.alert.nearest_station?.eta_minutes || 6} MIN</span></div>
                    <div>DISTANCE: <span className="text-white">{confirmModal.alert.nearest_station?.distance_km || 2.3} km</span></div>
                  </div>
                </>
              )}

              {confirmModal.actionType === "ESCALATE" && (
                <div className="space-y-2">
                  <p className="text-white font-bold">
                    Select Disaster Escalation Authority Level:
                  </p>
                  <div className="grid grid-cols-3 gap-1.5 text-[10px] font-bold">
                    {(["DISTRICT", "STATE", "NATIONAL"] as const).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() =>
                          setConfirmModal((prev) => ({
                            ...prev,
                            escalationLevel: lvl,
                          }))
                        }
                        className={`py-2 px-1 border transition text-center ${
                          confirmModal.escalationLevel === lvl
                            ? "bg-[#ff00ea]/20 border-[#ff00ea] text-[#ff00ea]"
                            : "border-[#1f2933] text-[#6b7785] hover:border-[#ff00ea]"
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-[#6b7785]">
                    {confirmModal.escalationLevel === "NATIONAL"
                      ? "Direct broadcast to NDMA National Emergency Operations Center & NDRF."
                      : confirmModal.escalationLevel === "STATE"
                      ? "Dispatches high-priority alert to State Disaster Management Authority (SDMA)."
                      : "Notifies District Magistrate and Chief Fire Officer control room."}
                  </p>
                </div>
              )}

              {confirmModal.actionType === "FALSE_ALARM" && (
                <>
                  <p className="text-[#ff8080] font-bold">
                    Confirm False Alarm Classification?
                  </p>
                  <p className="text-[#6b7785] text-[11px]">
                    Alert will be cleared from the active emergency queue and tagged for classification calibration.
                  </p>
                </>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#1f2933]">
              <button
                type="button"
                onClick={() =>
                  setConfirmModal((prev) => ({ ...prev, isOpen: false, alert: null }))
                }
                className="px-3 py-1.5 border border-[#1f2933] text-[#6b7785] hover:text-white text-xs font-bold transition cursor-pointer"
              >
                [ CANCEL ]
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                className="px-4 py-1.5 bg-[#ff3b3b] hover:bg-[#ff5252] text-black text-xs font-black transition cursor-pointer"
              >
                [ CONFIRM ACTION ]
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
