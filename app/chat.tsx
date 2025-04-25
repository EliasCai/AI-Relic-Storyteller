import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Image,
  ActivityIndicator,
  Keyboard
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Send,
  Mic,
  MicOff,
  Info
} from 'lucide-react-native';

import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import { colors, spacing, shadows } from '@/constants/theme';

const { width } = Dimensions.get('window');

// 模拟文物数据
const artifactData = {
  id: '1',
  name: '青花瓷龙纹碗',
  dynasty: '明朝',
  period: '永乐年间 (1403-1424)',
  image: 'https://images.pexels.com/photos/14918486/pexels-photo-14918486.jpeg',
};

// 预设的问题建议
const suggestedQuestions = [
  '你是什么时候被制造的？',
  '你的主人是谁？',
  '你当时是用来做什么的？',
  '你身上的图案有什么含义？',
  '你经历过哪些重要的历史事件？',
  '你是如何被发现的？'
];

// 预设的对话示例
const initialMessages = [
  {
    id: '1',
    sender: 'artifact',
    text: `你好！我是一件来自明朝永乐年间的青花瓷龙纹碗。很高兴能与你交流！你可以问我关于我的历史、用途或者制作工艺的问题。`,
    timestamp: new Date(Date.now() - 60000)
  }
];

interface Message {
  id: string;
  sender: 'user' | 'artifact';
  text: string;
  timestamp: Date;
  isLoading?: boolean;
}

export default function ChatScreen() {
  const params = useLocalSearchParams();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [suggestedQuestionsVisible, setSuggestedQuestionsVisible] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);
  
  // 自动滚动到底部
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);
  
  // 模拟发送消息和接收回复
  const handleSendMessage = () => {
    if (inputText.trim() === '') return;
    
    // 添加用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText.trim(),
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setSuggestedQuestionsVisible(false);
    
    // 显示文物正在输入状态
    setIsTyping(true);
    
    // 模拟文物回复延迟
    setTimeout(() => {
      setIsTyping(false);
      
      // 根据问题生成回复
      let reply = '';
      const question = userMessage.text.toLowerCase();
      
      if (question.includes('制造') || question.includes('被创造') || question.includes('什么时候')) {
        reply = '我诞生于明朝永乐年间，大约1410年左右。那时是中国瓷器发展的黄金时期，我是在景德镇官窑精心烧制而成的。当时的工匠们技艺精湛，每一道工序都极为讲究。';
      } else if (question.includes('主人')) {
        reply = '我最初的主人是明朝宫廷中的一位高级官员，他经常用我来招待重要宾客。后来我被赠送给了一位外国使臣，辗转多地后又回到了中国，最终被收藏在故宫博物院。';
      } else if (question.includes('用来做什么') || question.includes('用途')) {
        reply = '我是一件实用与艺术完美结合的器物。在宫廷中，我主要被用于盛放汤羹或精致的点心。因为我的造型优美，图案精美，所以不仅仅是餐具，也是身份与地位的象征。';
      } else if (question.includes('图案') || question.includes('纹饰') || question.includes('龙')) {
        reply = '我身上的青花龙纹是明代官窑的经典纹饰。龙是皇权的象征，代表着至高无上的权力。我身上的龙姿态矫健，鳞片清晰，气势磅礴，展现了明代工匠高超的绘画技艺。内底还有缠枝莲纹，象征着纯洁与和谐。';
      } else if (question.includes('历史事件') || question.includes('经历')) {
        reply = '我经历了明朝的繁荣，见证了中国与外国的文化交流。在16世纪，我曾随使臣出访海外，后来又辗转多地。在清朝康熙年间，我被一位收藏家收入囊中，躲过了战乱。新中国成立后，我被捐赠给了故宫博物院，成为国家珍贵文物。';
      } else if (question.includes('发现') || question.includes('出土')) {
        reply = '我并非出土文物，而是传世品。我一直在不同收藏家手中传承，直到20世纪中期被鉴定为明代永乐官窑真品，引起了学术界的广泛关注。2008年，我在一次重要的文物展览中亮相，让更多人了解到明代瓷器的精美。';
      } else {
        reply = '这是个很有趣的问题！作为一件有着600多年历史的青花瓷，我见证了许多朝代更迭和文化变迁。你还想了解我的哪些方面呢？';
      }
      
      // 添加文物回复
      const artifactMessage: Message = {
        id: Date.now().toString(),
        sender: 'artifact',
        text: reply,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, artifactMessage]);
      
      // 如果对话超过3条，随机显示推荐问题
      if (messages.length >= 3 && Math.random() > 0.5) {
        setSuggestedQuestionsVisible(true);
      }
    }, 1500);
  };
  
  const handleSuggestedQuestionPress = (question: string) => {
    setInputText(question);
    inputRef.current?.focus();
  };
  
  const toggleVoiceRecording = () => {
    // 在实际应用中，这里会实现语音识别功能
    setIsRecording(!isRecording);
    if (isRecording) {
      // 模拟语音识别结果
      setTimeout(() => {
        setInputText('你身上的图案有什么含义？');
      }, 1000);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft color={colors.gray[800]} size={24} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.headerCenter}>
          <Image
            source={{ uri: artifactData.image }}
            style={styles.artifactImage}
          />
          <View style={styles.artifactInfo}>
            <Text variant="h4" weight="bold" numberOfLines={1}>
              {artifactData.name}
            </Text>
            <Text variant="caption" color={colors.gray[600]}>
              {artifactData.dynasty} · {artifactData.period}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.headerRight}>
          <Info size={24} color={colors.gray[600]} />
        </TouchableOpacity>
      </View>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageBubble,
                message.sender === 'user'
                  ? styles.userBubble
                  : styles.artifactBubble
              ]}
            >
              <Text
                variant="body1"
                color={message.sender === 'user' ? colors.white : colors.gray[800]}
              >
                {message.text}
              </Text>
              <Text
                variant="caption"
                color={message.sender === 'user' ? colors.gray[200] : colors.gray[500]}
                style={styles.messageTime}
              >
                {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>
            </View>
          ))}
          
          {isTyping && (
            <View style={[styles.messageBubble, styles.artifactBubble, styles.typingBubble]}>
              <ActivityIndicator size="small" color={colors.primary[500]} />
              <Text variant="caption" color={colors.gray[600]} style={{ marginLeft: 8 }}>
                正在输入...
              </Text>
            </View>
          )}
        </ScrollView>
        
        {suggestedQuestionsVisible && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.suggestedQuestionsContainer}
            contentContainerStyle={styles.suggestedQuestionsContent}
          >
            {suggestedQuestions.map((question, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestedQuestionButton}
                onPress={() => handleSuggestedQuestionPress(question)}
              >
                <Text variant="body2" color={colors.primary[600]}>
                  {question}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
        
        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={styles.micButton}
            onPress={toggleVoiceRecording}
          >
            {isRecording ? (
              <MicOff size={24} color={colors.secondary[500]} />
            ) : (
              <Mic size={24} color={colors.gray[600]} />
            )}
          </TouchableOpacity>
          
          <TextInput
            ref={inputRef}
            style={styles.textInput}
            placeholder="输入你想问的问题..."
            placeholderTextColor={colors.gray[400]}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
            onSubmitEditing={handleSendMessage}
          />
          
          <TouchableOpacity
            style={[
              styles.sendButton,
              inputText.trim() === '' ? styles.sendButtonDisabled : {}
            ]}
            onPress={handleSendMessage}
            disabled={inputText.trim() === ''}
          >
            <Send
              size={20}
              color={
                inputText.trim() === ''
                  ? colors.gray[400]
                  : colors.white
              }
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50]
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
    backgroundColor: colors.white,
    ...shadows.sm
  },
  headerLeft: {
    width: 40
  },
  backButton: {
    padding: spacing.xs
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  artifactImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: spacing.sm
  },
  artifactInfo: {
    flex: 1
  },
  headerRight: {
    width: 40,
    alignItems: 'flex-end'
  },
  keyboardAvoidingView: {
    flex: 1
  },
  messagesContainer: {
    flex: 1
  },
  messagesContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl
  },
  messageBubble: {
    maxWidth: '80%',
    padding: spacing.md,
    borderRadius: 16,
    marginBottom: spacing.md
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary[500],
    borderBottomRightRadius: 4
  },
  artifactBubble: {
    alignSelf: 'flex-start',
    backgroundColor: colors.white,
    borderBottomLeftRadius: 4,
    ...shadows.sm
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm
  },
  messageTime: {
    alignSelf: 'flex-end',
    marginTop: spacing.xs
  },
  suggestedQuestionsContainer: {
    maxHeight: 50,
    marginBottom: spacing.sm
  },
  suggestedQuestionsContent: {
    paddingHorizontal: spacing.md
  },
  suggestedQuestionButton: {
    backgroundColor: colors.gray[100],
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.primary[100]
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    ...shadows.sm
  },
  micButton: {
    padding: spacing.xs,
    marginRight: spacing.sm
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: colors.gray[100],
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    fontSize: 16,
    color: colors.gray[800]
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm
  },
  sendButtonDisabled: {
    backgroundColor: colors.gray[300]
  }
});