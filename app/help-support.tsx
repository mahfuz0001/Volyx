import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ChevronLeft,
  Search,
  MessageCircle,
  Mail,
  Phone,
  HelpCircle,
  Book,
  Video,
  Users,
  Send,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AnimatedCard from '@/components/AnimatedCard';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface SupportOption {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  action: () => void;
}

const faqData: FAQItem[] = [
  {
    id: '1',
    question: 'How do I place a bid on an auction?',
    answer: 'To place a bid, navigate to the auction item you\'re interested in, tap "Place Bid", enter your bid amount (must be higher than current bid), and confirm. You\'ll need sufficient Connects in your account.',
    category: 'Bidding',
  },
  {
    id: '2',
    question: 'What are Connects and how do I get them?',
    answer: 'Connects are our virtual currency used for bidding. You can earn them by watching video ads (up to 10 per day) or purchase them directly through our Connects packages. Starting users receive 100 free Connects.',
    category: 'Connects',
  },
  {
    id: '3',
    question: 'What happens if I win an auction?',
    answer: 'Congratulations! When you win, you\'ll receive a notification and email with payment and shipping instructions. You have 48 hours to complete payment, after which the item will be shipped to your registered address.',
    category: 'Winning',
  },
  {
    id: '4',
    question: 'Can I cancel a bid after placing it?',
    answer: 'Bids are binding and cannot be cancelled once placed. This ensures fair play for all participants. Please bid responsibly and only bid amounts you\'re comfortable with.',
    category: 'Bidding',
  },
  {
    id: '5',
    question: 'How do I know if an item is authentic?',
    answer: 'All items undergo rigorous authentication by our expert curators. Each listing includes detailed authenticity information, certificates where applicable, and high-resolution photos. We guarantee authenticity or your money back.',
    category: 'Authentication',
  },
  {
    id: '6',
    question: 'What is the return policy?',
    answer: 'We offer a 7-day return policy for items that don\'t match their description. Items must be returned in original condition. Authenticity disputes are handled case-by-case with full investigation.',
    category: 'Returns',
  },
];

export default function HelpSupportScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [contactMessage, setContactMessage] = useState('');

  const supportOptions: SupportOption[] = [
    {
      id: '1',
      title: 'Live Chat',
      description: 'Chat with our support team',
      icon: MessageCircle,
      color: '#16A34A',
      action: () => Alert.alert('Live Chat', 'Connecting you to our support team...'),
    },
    {
      id: '2',
      title: 'Email Support',
      description: 'Send us an email',
      icon: Mail,
      color: '#2196F3',
      action: () => Alert.alert('Email Support', 'Opening your email client...'),
    },
    {
      id: '3',
      title: 'Phone Support',
      description: 'Call us directly',
      icon: Phone,
      color: '#FF7F00',
      action: () => Alert.alert('Phone Support', 'Calling +1 (555) 123-4567...'),
    },
    {
      id: '4',
      title: 'Video Tutorials',
      description: 'Watch how-to videos',
      icon: Video,
      color: '#7C3AED',
      action: () => Alert.alert('Video Tutorials', 'Opening video library...'),
    },
  ];

  const filteredFAQs = faqData.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = [...new Set(faqData.map(faq => faq.category))];

  const toggleFAQ = (faqId: string) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  };

  const sendMessage = () => {
    if (contactMessage.trim()) {
      Alert.alert(
        'Message Sent',
        'Thank you for contacting us! We\'ll get back to you within 24 hours.',
        [{ text: 'OK', onPress: () => setContactMessage('') }]
      );
    }
  };

  const SupportOptionCard = ({ option }: { option: SupportOption }) => {
    const IconComponent = option.icon;
    return (
      <TouchableOpacity
        style={styles.supportOptionCard}
        onPress={option.action}
        activeOpacity={0.7}
      >
        <View style={[styles.supportOptionIcon, { backgroundColor: `${option.color}20` }]}>
          <IconComponent size={24} color={option.color} />
        </View>
        <View style={styles.supportOptionText}>
          <Text style={styles.supportOptionTitle}>{option.title}</Text>
          <Text style={styles.supportOptionDescription}>{option.description}</Text>
        </View>
        <ChevronRight size={16} color="#9CA3AF" />
      </TouchableOpacity>
    );
  };

  const FAQCard = ({ faq }: { faq: FAQItem }) => {
    const isExpanded = expandedFAQ === faq.id;
    return (
      <AnimatedCard style={styles.faqCard}>
        <TouchableOpacity
          style={styles.faqHeader}
          onPress={() => toggleFAQ(faq.id)}
          activeOpacity={0.7}
        >
          <View style={styles.faqQuestion}>
            <Text style={styles.faqQuestionText}>{faq.question}</Text>
            <View style={styles.faqCategory}>
              <Text style={styles.faqCategoryText}>{faq.category}</Text>
            </View>
          </View>
          {isExpanded ? (
            <ChevronUp size={20} color="#6B7280" />
          ) : (
            <ChevronDown size={20} color="#6B7280" />
          )}
        </TouchableOpacity>
        
        {isExpanded && (
          <View style={styles.faqAnswer}>
            <Text style={styles.faqAnswerText}>{faq.answer}</Text>
          </View>
        )}
      </AnimatedCard>
    );
  };

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
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <AnimatedCard delay={100} style={styles.welcomeSection}>
          <LinearGradient
            colors={['#FF7F00', '#FF6B35']}
            style={styles.welcomeGradient}
          >
            <HelpCircle size={32} color="#FFFFFF" />
            <Text style={styles.welcomeTitle}>How can we help you?</Text>
            <Text style={styles.welcomeSubtitle}>
              Find answers to common questions or get in touch with our support team
            </Text>
          </LinearGradient>
        </AnimatedCard>

        {/* Support Options */}
        <AnimatedCard delay={200} style={styles.supportOptionsSection}>
          <Text style={styles.sectionTitle}>Get Support</Text>
          <View style={styles.supportOptionsGrid}>
            {supportOptions.map((option) => (
              <SupportOptionCard key={option.id} option={option} />
            ))}
          </View>
        </AnimatedCard>

        {/* Quick Actions */}
        <AnimatedCard delay={300} style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsList}>
            <TouchableOpacity style={styles.quickAction}>
              <Book size={20} color="#2196F3" />
              <Text style={styles.quickActionText}>User Guide</Text>
              <ExternalLink size={16} color="#9CA3AF" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickAction}>
              <Users size={20} color="#16A34A" />
              <Text style={styles.quickActionText}>Community Forum</Text>
              <ExternalLink size={16} color="#9CA3AF" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickAction}>
              <Video size={20} color="#7C3AED" />
              <Text style={styles.quickActionText}>Video Tutorials</Text>
              <ExternalLink size={16} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </AnimatedCard>

        {/* FAQ Search */}
        <AnimatedCard delay={400} style={styles.faqSection}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          
          <View style={styles.searchContainer}>
            <Search size={20} color="#6B7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search FAQs..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.faqList}>
            {filteredFAQs.map((faq) => (
              <FAQCard key={faq.id} faq={faq} />
            ))}
          </View>

          {filteredFAQs.length === 0 && searchQuery && (
            <View style={styles.noResults}>
              <HelpCircle size={48} color="#D1D5DB" />
              <Text style={styles.noResultsTitle}>No results found</Text>
              <Text style={styles.noResultsSubtitle}>
                Try different keywords or contact our support team
              </Text>
            </View>
          )}
        </AnimatedCard>

        {/* Contact Form */}
        <AnimatedCard delay={500} style={styles.contactSection}>
          <Text style={styles.sectionTitle}>Still need help?</Text>
          <Text style={styles.contactDescription}>
            Send us a message and we'll get back to you within 24 hours
          </Text>
          
          <View style={styles.contactForm}>
            <TextInput
              style={styles.messageInput}
              placeholder="Describe your issue or question..."
              value={contactMessage}
              onChangeText={setContactMessage}
              multiline
              numberOfLines={4}
              placeholderTextColor="#9CA3AF"
            />
            
            <TouchableOpacity
              style={[
                styles.sendButton,
                !contactMessage.trim() && styles.sendButtonDisabled
              ]}
              onPress={sendMessage}
              disabled={!contactMessage.trim()}
            >
              <LinearGradient
                colors={contactMessage.trim() ? ['#FF7F00', '#FF6B35'] : ['#E5E7EB', '#E5E7EB']}
                style={styles.sendButtonGradient}
              >
                <Send size={16} color={contactMessage.trim() ? '#FFFFFF' : '#9CA3AF'} />
                <Text style={[
                  styles.sendButtonText,
                  { color: contactMessage.trim() ? '#FFFFFF' : '#9CA3AF' }
                ]}>
                  Send Message
                </Text>
              </LinearGradient>
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
  content: {
    flex: 1,
  },
  welcomeSection: {
    margin: 20,
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  welcomeGradient: {
    padding: 32,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
  },
  supportOptionsSection: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1A2B42',
    marginBottom: 16,
  },
  supportOptionsGrid: {
    gap: 12,
  },
  supportOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  supportOptionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  supportOptionText: {
    flex: 1,
  },
  supportOptionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1A2B42',
    marginBottom: 2,
  },
  supportOptionDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  quickActionsSection: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
  },
  quickActionsList: {
    gap: 12,
  },
  quickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  quickActionText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1A2B42',
    marginLeft: 12,
  },
  faqSection: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1A2B42',
    marginLeft: 12,
  },
  faqList: {
    gap: 12,
  },
  faqCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
  },
  faqQuestion: {
    flex: 1,
    marginRight: 12,
  },
  faqQuestionText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1A2B42',
    lineHeight: 22,
    marginBottom: 8,
  },
  faqCategory: {
    backgroundColor: '#FF7F00',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  faqCategoryText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  faqAnswer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  faqAnswerText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginTop: 12,
  },
  noResults: {
    alignItems: 'center',
    padding: 32,
  },
  noResultsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1A2B42',
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  contactSection: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
  },
  contactDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 20,
    lineHeight: 20,
  },
  contactForm: {
    gap: 16,
  },
  messageInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1A2B42',
    textAlignVertical: 'top',
    minHeight: 100,
  },
  sendButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  sendButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
  },
  bottomPadding: {
    height: 100,
  },
});