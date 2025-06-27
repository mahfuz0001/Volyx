import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ChevronLeft,
  FileText,
  Shield,
  Users,
  Eye,
  Lock,
  Globe,
  Calendar,
  ExternalLink,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AnimatedCard from '@/components/AnimatedCard';

type DocumentType = 'terms' | 'privacy' | 'community';

interface DocumentSection {
  id: string;
  title: string;
  content: string;
}

const termsOfService: DocumentSection[] = [
  {
    id: '1',
    title: 'Acceptance of Terms',
    content: 'By accessing and using Volyx, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.',
  },
  {
    id: '2',
    title: 'Auction Participation',
    content: 'All bids placed on our platform are binding. Once you place a bid, you enter into a legal commitment to purchase the item if you are the winning bidder. Bids cannot be retracted once placed.',
  },
  {
    id: '3',
    title: 'Connects Currency',
    content: 'Connects are our virtual currency used for bidding. Connects have no cash value and cannot be exchanged for real money. Unused Connects do not expire but may be subject to account inactivity policies.',
  },
  {
    id: '4',
    title: 'Payment and Shipping',
    content: 'Winning bidders must complete payment within 48 hours of auction end. We accept major credit cards and digital payment methods. Shipping costs are additional and calculated based on item size and destination.',
  },
  {
    id: '5',
    title: 'Authenticity Guarantee',
    content: 'We guarantee the authenticity of all items sold on our platform. Items undergo rigorous authentication by our expert team. If an item is found to be inauthentic, we provide a full refund.',
  },
  {
    id: '6',
    title: 'User Conduct',
    content: 'Users must not engage in fraudulent bidding, create multiple accounts, or attempt to manipulate auction outcomes. Violation of these rules may result in account suspension or termination.',
  },
  {
    id: '7',
    title: 'Limitation of Liability',
    content: 'Volyx shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.',
  },
];

const privacyPolicy: DocumentSection[] = [
  {
    id: '1',
    title: 'Information We Collect',
    content: 'We collect information you provide directly to us, such as when you create an account, place bids, or contact us. This includes your name, email address, phone number, and payment information.',
  },
  {
    id: '2',
    title: 'How We Use Your Information',
    content: 'We use your information to provide our services, process transactions, send notifications about your account and auctions, and improve our platform. We may also use it for fraud prevention and security purposes.',
  },
  {
    id: '3',
    title: 'Information Sharing',
    content: 'We do not sell, trade, or rent your personal information to third parties. We may share information with service providers who assist us in operating our platform, conducting business, or serving users.',
  },
  {
    id: '4',
    title: 'Data Security',
    content: 'We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.',
  },
  {
    id: '5',
    title: 'Cookies and Tracking',
    content: 'We use cookies and similar tracking technologies to enhance your experience, analyze usage patterns, and personalize content. You can control cookie settings through your browser preferences.',
  },
  {
    id: '6',
    title: 'Your Rights',
    content: 'You have the right to access, update, or delete your personal information. You may also opt out of certain communications and request data portability where applicable under local laws.',
  },
  {
    id: '7',
    title: 'Children\'s Privacy',
    content: 'Our service is not intended for children under 13. We do not knowingly collect personal information from children under 13. If we become aware of such collection, we will delete the information immediately.',
  },
];

const communityGuidelines: DocumentSection[] = [
  {
    id: '1',
    title: 'Respectful Behavior',
    content: 'Treat all community members with respect and courtesy. Harassment, discrimination, or abusive behavior of any kind will not be tolerated and may result in account suspension.',
  },
  {
    id: '2',
    title: 'Fair Bidding Practices',
    content: 'Bid in good faith and only on items you intend to purchase. Shill bidding, bid manipulation, or creating multiple accounts to circumvent bidding rules is strictly prohibited.',
  },
  {
    id: '3',
    title: 'Accurate Information',
    content: 'Provide accurate and truthful information in your profile and communications. Misrepresentation of identity or false information may result in account termination.',
  },
  {
    id: '4',
    title: 'Intellectual Property',
    content: 'Respect intellectual property rights. Do not use copyrighted images, trademarks, or other protected content without proper authorization.',
  },
  {
    id: '5',
    title: 'Prohibited Content',
    content: 'Do not post or share content that is illegal, harmful, threatening, abusive, defamatory, or otherwise objectionable. This includes spam, malware, or any content that violates applicable laws.',
  },
  {
    id: '6',
    title: 'Reporting Violations',
    content: 'If you encounter behavior that violates these guidelines, please report it to our support team. We investigate all reports and take appropriate action to maintain a safe community.',
  },
];

export default function TermsPrivacyScreen() {
  const router = useRouter();
  const [activeDocument, setActiveDocument] = useState<DocumentType>('terms');

  const getDocumentData = () => {
    switch (activeDocument) {
      case 'terms':
        return { title: 'Terms of Service', sections: termsOfService, icon: FileText };
      case 'privacy':
        return { title: 'Privacy Policy', sections: privacyPolicy, icon: Shield };
      case 'community':
        return { title: 'Community Guidelines', sections: communityGuidelines, icon: Users };
      default:
        return { title: 'Terms of Service', sections: termsOfService, icon: FileText };
    }
  };

  const documentData = getDocumentData();
  const IconComponent = documentData.icon;

  const DocumentTab = ({ 
    type, 
    title, 
    icon: TabIcon, 
    isActive 
  }: { 
    type: DocumentType; 
    title: string; 
    icon: any; 
    isActive: boolean; 
  }) => (
    <TouchableOpacity
      style={[styles.documentTab, isActive && styles.documentTabActive]}
      onPress={() => setActiveDocument(type)}
    >
      <TabIcon size={16} color={isActive ? '#FFFFFF' : '#6B7280'} />
      <Text style={[
        styles.documentTabText,
        isActive && styles.documentTabTextActive
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const SectionCard = ({ section }: { section: DocumentSection }) => (
    <AnimatedCard style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <Text style={styles.sectionContent}>{section.content}</Text>
    </AnimatedCard>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color="#1A2B42" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Legal</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Document Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContent}
        >
          <DocumentTab
            type="terms"
            title="Terms"
            icon={FileText}
            isActive={activeDocument === 'terms'}
          />
          <DocumentTab
            type="privacy"
            title="Privacy"
            icon={Shield}
            isActive={activeDocument === 'privacy'}
          />
          <DocumentTab
            type="community"
            title="Community"
            icon={Users}
            isActive={activeDocument === 'community'}
          />
        </ScrollView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Document Header */}
        <AnimatedCard delay={100} style={styles.documentHeader}>
          <LinearGradient
            colors={['#FF7F00', '#FF6B35']}
            style={styles.documentHeaderGradient}
          >
            <IconComponent size={32} color="#FFFFFF" />
            <Text style={styles.documentTitle}>{documentData.title}</Text>
            <View style={styles.documentMeta}>
              <Calendar size={16} color="rgba(255, 255, 255, 0.8)" />
              <Text style={styles.documentDate}>Last updated: January 15, 2024</Text>
            </View>
          </LinearGradient>
        </AnimatedCard>

        {/* Document Sections */}
        <View style={styles.sectionsContainer}>
          {documentData.sections.map((section, index) => (
            <SectionCard key={section.id} section={section} />
          ))}
        </View>

        {/* Contact Information */}
        <AnimatedCard delay={300} style={styles.contactCard}>
          <Text style={styles.contactTitle}>Questions about this document?</Text>
          <Text style={styles.contactDescription}>
            If you have any questions about our {documentData.title.toLowerCase()}, 
            please don't hesitate to contact us.
          </Text>
          
          <View style={styles.contactActions}>
            <TouchableOpacity style={styles.contactButton}>
              <LinearGradient
                colors={['#2196F3', '#1976D2']}
                style={styles.contactButtonGradient}
              >
                <Eye size={16} color="#FFFFFF" />
                <Text style={styles.contactButtonText}>Contact Support</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.externalButton}>
              <Globe size={16} color="#6B7280" />
              <Text style={styles.externalButtonText}>View Online</Text>
              <ExternalLink size={14} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </AnimatedCard>

        {/* Additional Resources */}
        <AnimatedCard delay={400} style={styles.resourcesCard}>
          <Text style={styles.resourcesTitle}>Additional Resources</Text>
          
          <View style={styles.resourcesList}>
            <TouchableOpacity style={styles.resourceItem}>
              <FileText size={20} color="#2196F3" />
              <Text style={styles.resourceText}>User Agreement</Text>
              <ExternalLink size={16} color="#9CA3AF" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.resourceItem}>
              <Lock size={20} color="#16A34A" />
              <Text style={styles.resourceText}>Security Center</Text>
              <ExternalLink size={16} color="#9CA3AF" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.resourceItem}>
              <Shield size={20} color="#7C3AED" />
              <Text style={styles.resourceText}>Safety Guidelines</Text>
              <ExternalLink size={16} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </AnimatedCard>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1A2B42',
  },
  headerSpacer: {
    width: 40,
  },
  tabsContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tabsContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  documentTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    gap: 6,
  },
  documentTabActive: {
    backgroundColor: '#FF7F00',
  },
  documentTabText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  documentTabTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  documentHeader: {
    margin: 20,
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  documentHeaderGradient: {
    padding: 32,
    alignItems: 'center',
  },
  documentTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  documentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  documentDate: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 6,
  },
  sectionsContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1A2B42',
    marginBottom: 12,
  },
  sectionContent: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 24,
  },
  contactCard: {
    marginHorizontal: 20,
    marginTop: 16,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
  },
  contactTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1A2B42',
    marginBottom: 8,
  },
  contactDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 20,
  },
  contactActions: {
    gap: 12,
  },
  contactButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  contactButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  contactButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  externalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
  },
  externalButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginLeft: 8,
    marginRight: 6,
  },
  resourcesCard: {
    marginHorizontal: 20,
    marginTop: 16,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
  },
  resourcesTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1A2B42',
    marginBottom: 16,
  },
  resourcesList: {
    gap: 12,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  resourceText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1A2B42',
    marginLeft: 12,
  },
  bottomPadding: {
    height: 100,
  },
});