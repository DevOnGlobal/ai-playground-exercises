import { Customer, CustomerImpact, CustomerType } from '../types/customer';
import { OutageIncident } from '../types/outage';
import { OutageDataLoader } from '../utils/dataLoader';

export interface Notification {
  id: string;
  customerId: string;
  incidentId: string;
  message: string;
  channels: ('SMS' | 'EMAIL' | 'PHONE')[];
  priority: 'IMMEDIATE' | 'HIGH' | 'NORMAL';
  scheduledTime: Date;
  attempts: number;
  delivered: boolean;
}

export interface DeliveryAttempt {
  notificationId: string;
  channel: string;
  attemptTime: Date;
  success: boolean;
  failureReason?: string;
}

export class CustomerCommunicationService {
  private customers: Customer[];
  private notificationQueue: Notification[];
  private deliveryLog: DeliveryAttempt[];

  constructor() {
    this.customers = OutageDataLoader.loadCustomerDatabase();
    this.notificationQueue = [];
    this.deliveryLog = [];
  }

  /**
   * Schedules outage notifications for affected customers.
   * @param incident The outage incident.
   */
  scheduleOutageNotifications(incident: OutageIncident): void {
    // TODO: Implement scheduling of outage notifications.
    // Scenario: Transformer failure affects 1,200 customers including 1 hospital and 15 businesses
    // Find affected customers using OutageDataLoader.getCustomersAffectedByEquipment()
    // Group customers by communication preferences
    // Create personalized messages based on customer type and incident details
    // Schedule delivery with appropriate timing (immediate for critical, 15min delay for others)

    const affectedCustomers = OutageDataLoader.getCustomersAffectedByEquipment(incident.equipmentIds);

    affectedCustomers.forEach(customer => {
      const messageType = 'initial_outage'; // Or 'update', 'restored' etc.
      const personalizedMessage = this.generatePersonalizedMessage(customer, incident, messageType);

      let priority: Notification['priority'] = 'NORMAL';
      let scheduledTime = new Date();

      if (customer.type === CustomerType.CRITICAL_INFRASTRUCTURE) {
        priority = 'IMMEDIATE';
      } else {
        // Schedule non-critical messages with a slight delay to avoid overwhelming systems
        scheduledTime = new Date(scheduledTime.getTime() + 15 * 60 * 1000); // 15 minutes delay
      }

      const notification: Notification = {
        id: `NOTIF-${Date.now()}-${customer.id}`,
        customerId: customer.id,
        incidentId: incident.id,
        message: personalizedMessage,
        channels: customer.communicationPreferences,
        priority: priority,
        scheduledTime: scheduledTime,
        attempts: 0,
        delivered: false,
      };

      this.notificationQueue.push(notification);
      console.log(`Scheduled notification for ${customer.name} (ID: ${customer.id}) via ${customer.communicationPreferences.join(', ')}`);
    });
  }

  /**
   * Generates a personalized message for a customer based on incident details.
   * @param customer The customer to generate the message for.
   * @param incident The outage incident.
   * @param messageType The type of message (e.g., 'initial_outage', 'update', 'restored').
   * @returns The personalized message string.
   */
  generatePersonalizedMessage(customer: Customer, incident: OutageIncident, messageType: string): string {
    // TODO: Implement personalized message generation.
    // Critical Infrastructure: "PRIORITY ALERT: Power outage at [location]. Estimated restoration: [time]. Crew dispatched. Emergency backup recommended."
    // Commercial: "Power outage affecting your business at [address]. Cause: [cause]. Estimated restoration: [time]. Updates every 2 hours."
    // Residential: "Power outage in your area. We're working to restore service by [time]. Cause: [cause]. Check mobile app for updates."
    // Include specific incident details and realistic restoration times

    const eta = incident.estimatedRestorationTime ?
      incident.estimatedRestorationTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) :
      'an unknown time';
    const cause = incident.cause.replace(/_/g, ' ').toLowerCase();
    const location = customer.serviceAddress; // Simplified location

    const templates = {
      initial_outage: {
        CRITICAL_INFRASTRUCTURE: `PRIORITY ALERT: Power outage at ${location}. Estimated restoration: ${eta}. Crew dispatched. Emergency backup recommended. Incident ID: ${incident.id}.`,
        COMMERCIAL: `Power outage affecting your business at ${location}. Cause: ${cause}. Estimated restoration: ${eta}. Updates every 2 hours. Incident ID: ${incident.id}.`,
        RESIDENTIAL: `Power outage in your area. We're working to restore service by ${eta}. Cause: ${cause}. Check mobile app for updates. Incident ID: ${incident.id}.`
      },
      // TODO: Add more message types like 'update', 'restored', etc.
    };

    const template = templates[messageType]?.[customer.type] || templates[messageType]?.RESIDENTIAL;
    return template || `No specific message template found for ${messageType} and customer type ${customer.type}.`;
  }

  /**
   * Simulates message delivery through various channels.
   * @param notification The notification to simulate delivery for.
   * @returns A promise that resolves when delivery simulation is complete.
   */
  async simulateMessageDelivery(notification: Notification): Promise<void> {
    // TODO: Implement realistic delivery simulation and retry logic.
    // SMS: 95% success rate, 30 second delivery time
    // Email: 98% success rate, 2 minute delivery time
    // Phone: 85% success rate (busy signals, voicemail), 5 minute delivery time
    // Simulate realistic delivery failures and retry logic
    // Track delivery attempts for compliance reporting

    for (const channel of notification.channels) {
      const attempt: DeliveryAttempt = {
        notificationId: notification.id,
        channel: channel,
        attemptTime: new Date(),
        success: false,
      };

      let successRate: number;
      let deliveryTimeMs: number;

      switch (channel) {
        case 'SMS':
          successRate = 0.95;
          deliveryTimeMs = 30 * 1000; // 30 seconds
          break;
        case 'EMAIL':
          successRate = 0.98;
          deliveryTimeMs = 2 * 60 * 1000; // 2 minutes
          break;
        case 'PHONE':
          successRate = 0.85;
          deliveryTimeMs = 5 * 60 * 1000; // 5 minutes
          break;
        default:
          successRate = 0;
          deliveryTimeMs = 0;
          attempt.failureReason = 'Unsupported channel';
          break;
      }

      await new Promise(resolve => setTimeout(resolve, deliveryTimeMs)); // Simulate network delay

      if (Math.random() < successRate) {
        attempt.success = true;
        notification.delivered = true;
        console.log(`Notification ${notification.id} delivered successfully via ${channel}.`);
      } else {
        attempt.success = false;
        attempt.failureReason = `Simulated failure for ${channel}.`;
        console.warn(`Notification ${notification.id} failed to deliver via ${channel}. Reason: ${attempt.failureReason}`);
        // Implement retry logic here if needed (e.g., increment notification.attempts and re-queue)
      }
      this.deliveryLog.push(attempt);
    }
  }

  /**
   * Processes the notification queue, sending out scheduled notifications.
   */
  async processNotificationQueue(): Promise<void> {
    const now = new Date();
    const notificationsToSend = this.notificationQueue.filter(n =>
      !n.delivered && n.scheduledTime <= now
    );

    for (const notification of notificationsToSend) {
      await this.simulateMessageDelivery(notification);
      // Remove from queue or mark as processed
      notification.delivered = true; // Mark as delivered after attempts
    }
    // Filter out delivered notifications from the queue
    this.notificationQueue = this.notificationQueue.filter(n => !n.delivered);
  }
}
