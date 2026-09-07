import logging
from abc import ABC, abstractmethod
from datetime import datetime
from typing import Any

logger = logging.getLogger("ignis.dispatch.channels")


class NotificationChannel(ABC):
    """Abstract base class for emergency communication channels."""

    @abstractmethod
    def send(self, recipient: str, message: str, metadata: dict[str, Any] | None = None) -> dict[str, Any]:
        """Send emergency notification to specified recipient."""
        pass


class SMSChannel(NotificationChannel):
    """Simulates Twilio / Government National SMS Gateway for first responders."""

    def send(self, recipient: str, message: str, metadata: dict[str, Any] | None = None) -> dict[str, Any]:
        print(f"[SMS] To: {recipient}, Message: {message}")
        logger.info(
            f"[SMS] Emergency alert dispatched to {recipient}",
            extra={"channel": "SMS", "recipient": recipient, "preview": message[:60]},
        )
        return {
            "channel": "SMS",
            "provider": "Twilio / C-DoT National SMS Gateway",
            "recipient": recipient,
            "message": message,
            "status": "DELIVERED",
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "message_id": f"SM-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}-{abs(hash(recipient)) % 10000:04d}",
        }


class EmailChannel(NotificationChannel):
    """Simulates SendGrid / NIC Government Email System for District & NDMA authorities."""

    def send(self, recipient: str, message: str, metadata: dict[str, Any] | None = None) -> dict[str, Any]:
        subject = metadata.get("subject", "CRITICAL EMERGENCY ALERT - DISASTER RESPONSE") if metadata else "CRITICAL EMERGENCY ALERT"
        print(f"[EMAIL] To: {recipient}, Subject: {subject}")
        logger.info(
            f"[EMAIL] Emergency dispatch notification sent to {recipient}",
            extra={"channel": "EMAIL", "recipient": recipient, "subject": subject},
        )
        return {
            "channel": "EMAIL",
            "provider": "SendGrid / NIC Disaster Broadcast Relay",
            "recipient": recipient,
            "subject": subject,
            "message_preview": message[:120],
            "status": "DELIVERED",
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "email_id": f"EM-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}-{abs(hash(recipient)) % 10000:04d}",
        }


class RadioChannel(NotificationChannel):
    """Simulates VHF/UHF tactical radio broadcast across Emergency Response Channels."""

    def send(self, recipient: str, message: str, metadata: dict[str, Any] | None = None) -> dict[str, Any]:
        frequency = metadata.get("frequency", "VHF 154.280 MHz") if metadata else "VHF 154.280 MHz"
        channel_name = recipient or "CHANNEL-14"
        print(f"[RADIO] {channel_name}: Alert transmitted on {frequency}")
        logger.info(
            f"[RADIO] Broadcast transmitted on {channel_name}",
            extra={"channel": "RADIO", "channel_name": channel_name, "frequency": frequency},
        )
        return {
            "channel": "RADIO",
            "network": "POLNET / Tactical VHF Emergency Network",
            "channel_name": channel_name,
            "frequency": frequency,
            "signal_status": "BROADCAST_ACKNOWLEDGED",
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "repeater_status": "LOCKED",
        }


class WhatsAppChannel(NotificationChannel):
    """Simulates WhatsApp Business API for Instant Field Incident Command Push."""

    def send(self, recipient: str, message: str, metadata: dict[str, Any] | None = None) -> dict[str, Any]:
        print(f"[WHATSAPP] To: {recipient}, Alert sent")
        logger.info(
            f"[WHATSAPP] Instant operational template alert delivered to {recipient}",
            extra={"channel": "WHATSAPP", "recipient": recipient},
        )
        return {
            "channel": "WHATSAPP",
            "provider": "WhatsApp Business Platform (Disaster Response API)",
            "recipient": recipient,
            "template": "emergency_fire_incident_v2",
            "status": "DELIVERED",
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "wa_id": f"WA-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}-{abs(hash(recipient)) % 10000:04d}",
        }


def send_multi_channel_alert(
    fire: dict[str, Any],
    station: dict[str, Any],
    hospital: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """
    Broadcasts multi-channel alerts (SMS, Email, Radio, WhatsApp) simultaneously
    across all designated responders and disaster command endpoints.
    """
    lat = float(fire.get("latitude", 0.0))
    lon = float(fire.get("longitude", 0.0))
    category = fire.get("category", "EMERGENCY_INDUSTRIAL")
    frp = float(fire.get("frp", 0.0))
    facility = fire.get("facility_name") or fire.get("nearest_facility") or "Industrial Zone"

    station_name = station.get("name", "Surat Central Fire Station")
    station_phone = station.get("phone", "+91-9876543210")
    station_email = station.get("email", "control@surat-fire.gov.in")
    station_radio = station.get("radio", "CHANNEL-14")

    hosp_name = hospital.get("name", "Surat Civil Hospital") if hospital else "District Civil Hospital"
    hosp_phone = hospital.get("phone", "+91-261-2244175") if hospital else "+91-108"

    # Emergency Short Message (SMS)
    sms_text = (
        f"URGENT: Fire alert at {lat:.2f},{lon:.2f}. "
        f"{category} at {facility}. FRP: {frp:.1f}MW. "
        f"Foam/water tenders required. Target ETA {station.get('eta_minutes', 6)} min. "
        f"Reply DEPLOYED to confirm."
    )

    # Detailed Incident Summary (Email)
    email_text = (
        f"INCIDENT COMMAND NOTICE: High thermal anomaly detected by IGNIS at {lat:.4f}°N, {lon:.4f}°E.\n"
        f"Facility: {facility}\n"
        f"Category: {category}\n"
        f"Primary Assigned Fire Station: {station_name} (ETA: {station.get('eta_minutes', 6)} min)\n"
        f"Nearest Trauma Center: {hosp_name} ({hospital.get('distance_km', 4.5) if hospital else 'Local'} km)\n"
        f"Recommended Action: Mobilize Class B foam units and establish 500m perimeter."
    )

    sms_client = SMSChannel()
    email_client = EmailChannel()
    radio_client = RadioChannel()
    whatsapp_client = WhatsAppChannel()

    delivery_results: list[dict[str, Any]] = []

    # 1. SMS transmissions to Primary Station and District Collector
    delivery_results.append(sms_client.send(station_phone, sms_text, {"role": "FIRE_STATION"}))
    delivery_results.append(sms_client.send("+91-9876543211", sms_text, {"role": "DISTRICT_COLLECTOR"}))

    # 2. Email transmissions to Fire Control, DC, and NDMA
    delivery_results.append(
        email_client.send(
            station_email,
            email_text,
            {"subject": f"IGNIS EMERGENCY DISPATCH: {facility} [{category}]"},
        )
    )
    delivery_results.append(
        email_client.send(
            "dc@surat.gov.in",
            email_text,
            {"subject": f"URGENT: Disaster Ops Notice for District Collector - {facility}"},
        )
    )
    delivery_results.append(
        email_client.send(
            "ops@ndma.gov.in",
            email_text,
            {"subject": f"NATIONAL LEVEL ALERT: Major Thermal Anomaly - {facility}"},
        )
    )

    # 3. Radio Broadcast on Tactical Channel
    delivery_results.append(
        radio_client.send(
            station_radio,
            f"MAYDAY DISPATCH: Thermal anomaly at {lat:.2f},{lon:.2f}. All units respond on frequency.",
            {"frequency": "VHF 154.280 MHz Tactical"},
        )
    )

    # 4. WhatsApp Push Notification
    delivery_results.append(
        whatsapp_client.send(
            station_phone,
            f"🚨 *IGNIS DISASTER ALERT*: Immediate dispatch to {facility}. Coordinates: {lat},{lon}. Open tactical nav.",
        )
    )

    # 5. Medical alert to hospital
    if hospital:
        delivery_results.append(
            sms_client.send(
                hosp_phone,
                f"MEDICAL STANDBY: Burn trauma team alert requested for chemical incident near {facility}.",
                {"role": "HOSPITAL_TRAUMA_DESK"},
            )
        )

    return {
        "status": "ALL_CHANNELS_DELIVERED",
        "channels_count": len(delivery_results),
        "deliveries": delivery_results,
        "timestamp": datetime.utcnow().isoformat() + "Z",
    }
