import * as React from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView
} from 'react-native';
import { X, Check, ChevronDown } from 'lucide-react-native';

import Text from '@/components/ui/Text';
import { colors, spacing, borderRadius, shadows } from '@/constants/theme';

// 筛选器类型
export interface Filter {
  id: string;
  name: string;
  options: FilterOption[];
}

export interface FilterOption {
  id: string;
  name: string;
}

// 筛选状态
export interface FilterState {
  [filterId: string]: string | null; // filterId -> selectedOptionId
}

interface FilterPanelProps {
  filters: Filter[];
  activeFilters: FilterState;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
}

export default function FilterPanel({
  filters,
  activeFilters,
  onClose,
  onApply
}: FilterPanelProps) {
  const [selectedFilters, setSelectedFilters] = React.useState<FilterState>(activeFilters);
  const [expandedFilter, setExpandedFilter] = React.useState<string | null>(null);
  
  // 选择筛选选项
  const selectOption = (filterId: string, optionId: string | null) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterId]: optionId
    }));
    setExpandedFilter(null);
  };
  
  // 切换筛选器展开状态
  const toggleFilter = (filterId: string) => {
    setExpandedFilter(expandedFilter === filterId ? null : filterId);
  };
  
  // 重置所有筛选条件
  const resetFilters = () => {
    const resetState: FilterState = {};
    filters.forEach(filter => {
      resetState[filter.id] = null;
    });
    setSelectedFilters(resetState);
  };
  
  // 应用筛选器
  const handleApply = () => {
    onApply(selectedFilters);
    onClose();
  };
  
  // 检查是否有活动的筛选条件
  const hasActiveFilters = Object.values(selectedFilters).some(value => value !== null);
  
  // 获取选中的选项名称
  const getSelectedOptionName = (filterId: string) => {
    const selectedOptionId = selectedFilters[filterId];
    if (!selectedOptionId) return '不限';
    
    const filter = filters.find(f => f.id === filterId);
    if (!filter) return '不限';
    
    const option = filter.options.find(o => o.id === selectedOptionId);
    return option ? option.name : '不限';
  };
  
  return (
    <View style={styles.container}>
      {/* 顶部栏 */}
      <View style={styles.header}>
        <Text variant="h5" weight="semibold">筛选</Text>
        <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}>
          <X size={24} color={colors.gray[600]} />
        </TouchableOpacity>
      </View>
      
      {/* 筛选器列表 */}
      <ScrollView style={styles.filtersContainer}>
        {filters.map((filter) => (
          <View key={filter.id} style={styles.filterSection}>
            <TouchableOpacity 
              style={styles.filterHeader} 
              onPress={() => toggleFilter(filter.id)}
            >
              <Text weight="medium">{filter.name}</Text>
              <View style={styles.selectedOption}>
                <Text 
                  variant="body2" 
                  color={selectedFilters[filter.id] ? colors.primary[500] : colors.gray[500]}
                >
                  {getSelectedOptionName(filter.id)}
                </Text>
                <ChevronDown 
                  size={16} 
                  color={colors.gray[500]} 
                  style={{ 
                    transform: [{ rotate: expandedFilter === filter.id ? '180deg' : '0deg' }],
                    marginLeft: spacing.xs
                  }} 
                />
              </View>
            </TouchableOpacity>
            
            {expandedFilter === filter.id && (
              <View style={styles.optionsContainer}>
                <TouchableOpacity
                  style={styles.optionItem}
                  onPress={() => selectOption(filter.id, null)}
                >
                  <Text 
                    color={!selectedFilters[filter.id] ? colors.primary[500] : colors.gray[900]}
                  >
                    不限
                  </Text>
                  {!selectedFilters[filter.id] && (
                    <Check size={16} color={colors.primary[500]} />
                  )}
                </TouchableOpacity>
                
                {filter.options.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={styles.optionItem}
                    onPress={() => selectOption(filter.id, option.id)}
                  >
                    <Text 
                      color={selectedFilters[filter.id] === option.id ? colors.primary[500] : colors.gray[900]}
                    >
                      {option.name}
                    </Text>
                    {selectedFilters[filter.id] === option.id && (
                      <Check size={16} color={colors.primary[500]} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
      
      {/* 底部操作按钮 */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.button, styles.resetButton]} 
          onPress={resetFilters}
          disabled={!hasActiveFilters}
        >
          <Text 
            variant="button" 
            color={hasActiveFilters ? colors.gray[800] : colors.gray[400]}
          >
            重置
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.applyButton]} 
          onPress={handleApply}
        >
          <Text variant="button" color={colors.white}>
            应用
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    ...shadows.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  filtersContainer: {
    flex: 1,
  },
  filterSection: {
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  selectedOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionsContainer: {
    backgroundColor: colors.gray[50],
    paddingVertical: spacing.xs,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  footer: {
    flexDirection: 'row',
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  resetButton: {
    marginRight: spacing.sm,
    backgroundColor: colors.gray[100],
  },
  applyButton: {
    backgroundColor: colors.primary[500],
  },
}); 