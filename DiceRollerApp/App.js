import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  SafeAreaView,
  Alert,
} from 'react-native';

const App = () => {
  const [explodingDice, setExplodingDice] = useState(false);
  const [modifier, setModifier] = useState('');
  const [notationInput, setNotationInput] = useState('');
  const [rollHistory, setRollHistory] = useState([]);
  const [currentResults, setCurrentResults] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDie, setSelectedDie] = useState(null);
  const [diceCount, setDiceCount] = useState('1');

  const diceTypes = [
    { name: 'D4', sides: 4 },
    { name: 'D6', sides: 6 },
    { name: 'D8', sides: 8 },
    { name: 'D10', sides: 10 },
    { name: 'D12', sides: 12 },
    { name: 'D20', sides: 20 },
    { name: 'D100', sides: 100 },
  ];

  const parseModifier = () => {
    const modifierText = modifier.trim();
    if (!modifierText) return 0;
    const match = modifierText.match(/^([+\-]?\d+)$/);
    if (match) {
      return parseInt(match[1]);
    }
    return 0;
  };

  const rollSingleDie = (sides, exploding = false) => {
    let total = 0;
    let rolls = [];
    let currentRoll;

    do {
      currentRoll = Math.floor(Math.random() * sides) + 1;
      rolls.push(currentRoll);
      total += currentRoll;
    } while (exploding && currentRoll === sides);

    return { total, rolls };
  };

  const performRoll = (sides, count) => {
    const mod = parseModifier();
    const results = [];
    const detailedResults = [];

    for (let i = 0; i < count; i++) {
      if (explodingDice) {
        const dieResult = rollSingleDie(sides, true);
        results.push(dieResult.total);
        detailedResults.push(dieResult.rolls);
      } else {
        const roll = Math.floor(Math.random() * sides) + 1;
        results.push(roll);
        detailedResults.push([roll]);
      }
    }

    const diceTotal = results.reduce((sum, val) => sum + val, 0);
    const finalTotal = diceTotal + mod;

    const rollData = {
      sides,
      count,
      results,
      detailedResults,
      exploding: explodingDice,
      modifier: mod,
      diceTotal,
      total: finalTotal,
      timestamp: new Date(),
    };

    setCurrentResults(rollData);
    setRollHistory([rollData, ...rollHistory]);
  };

  const handleDieSelect = (sides) => {
    setSelectedDie(sides);
    setDiceCount('1');
    setModalVisible(true);
  };

  const handleRollDice = () => {
    const count = parseInt(diceCount);
    if (count < 1 || isNaN(count)) {
      Alert.alert('Invalid Input', 'Please enter a valid number of dice (at least 1)');
      return;
    }
    setModalVisible(false);
    performRoll(selectedDie, count);
  };

  const handleNotationRoll = () => {
    const notation = notationInput.trim().toLowerCase();
    const match = notation.match(/^(\d+)d(\d+)$/);

    if (!match) {
      Alert.alert('Invalid Notation', 'Use format like "2d6" or "5d20"');
      return;
    }

    const count = parseInt(match[1]);
    const sides = parseInt(match[2]);

    if (count < 1 || sides < 1) {
      Alert.alert('Invalid Input', 'Count and sides must be positive numbers');
      return;
    }

    performRoll(sides, count);
    setNotationInput('');
  };

  const clearHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear the roll history?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', onPress: () => setRollHistory([]) },
      ]
    );
  };

  const renderDiceGrid = () => (
    <View style={styles.diceGrid}>
      {diceTypes.map((die) => (
        <TouchableOpacity
          key={die.name}
          style={styles.diceButton}
          onPress={() => handleDieSelect(die.sides)}
        >
          <Text style={styles.diceButtonText}>{die.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderOptions = () => (
    <View style={styles.optionsSection}>
      <Text style={styles.sectionTitle}>Options</Text>
      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => setExplodingDice(!explodingDice)}
      >
        <View style={[styles.checkbox, explodingDice && styles.checkboxChecked]}>
          {explodingDice && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text style={styles.checkboxLabel}>Exploding Dice (Open-Ended)</Text>
      </TouchableOpacity>
      <View style={styles.modifierContainer}>
        <Text style={styles.modifierLabel}>Modifier:</Text>
        <TextInput
          style={styles.modifierInput}
          value={modifier}
          onChangeText={setModifier}
          placeholder="e.g., +3, -2"
          placeholderTextColor="#999"
        />
      </View>
    </View>
  );

  const renderNotationInput = () => (
    <View style={styles.notationSection}>
      <Text style={styles.sectionTitle}>Or use dice notation</Text>
      <View style={styles.notationInputGroup}>
        <TextInput
          style={styles.notationInput}
          value={notationInput}
          onChangeText={setNotationInput}
          placeholder="e.g., 2d6, 5d20"
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.rollButton} onPress={handleNotationRoll}>
          <Text style={styles.rollButtonText}>Roll</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderResults = () => {
    if (!currentResults) return null;

    const { sides, count, results, detailedResults, exploding, modifier: mod, diceTotal, total } = currentResults;
    const modeText = exploding ? ' (Exploding)' : '';
    const modifierText = mod !== 0 ? ` ${mod > 0 ? '+' : ''}${mod}` : '';

    return (
      <View style={styles.resultsSection}>
        <Text style={styles.resultsTitle}>
          Rolling {count}x D{sides}{modeText}{modifierText}
        </Text>
        <Text style={styles.resultsLabel}>Results:</Text>
        <View style={styles.resultsList}>
          {results.map((result, index) => (
            <View key={index} style={styles.dieResult}>
              <Text style={styles.dieResultText}>
                {result}
                {exploding && detailedResults[index].length > 1 && ' 💥'}
              </Text>
            </View>
          ))}
        </View>
        {(count > 1 || mod !== 0) && (
          <Text style={styles.totalText}>
            {count > 1 ? `Dice Total: ${diceTotal}` : `Total: ${results[0]}`}
            {mod !== 0 && ` ${mod > 0 ? '+' : ''}${mod} = ${total}`}
          </Text>
        )}
      </View>
    );
  };

  const renderHistory = () => (
    <View style={styles.historyPanel}>
      <Text style={styles.historyTitle}>Roll History</Text>
      <ScrollView style={styles.historyList}>
        {rollHistory.length === 0 ? (
          <Text style={styles.emptyHistory}>No rolls yet. Start rolling!</Text>
        ) : (
          rollHistory.map((roll, index) => {
            const modeText = roll.exploding ? ' 💥' : '';
            const modifierText = roll.modifier !== 0 ? ` ${roll.modifier > 0 ? '+' : ''}${roll.modifier}` : '';

            return (
              <View key={index} style={styles.historyItem}>
                <Text style={styles.historyItemHeader}>
                  {roll.count}x D{roll.sides}{modeText}{modifierText}
                </Text>
                <View style={styles.historyItemResults}>
                  {roll.results.map((result, idx) => (
                    <View key={idx} style={styles.historyDie}>
                      <Text style={styles.historyDieText}>
                        {result}
                        {roll.exploding && roll.detailedResults[idx].length > 1 && ' 💥'}
                      </Text>
                    </View>
                  ))}
                </View>
                {(roll.count > 1 || roll.modifier !== 0) && (
                  <Text style={styles.historyItemTotal}>
                    {roll.modifier !== 0
                      ? `Total: ${roll.diceTotal} ${roll.modifier > 0 ? '+' : ''}${roll.modifier} = ${roll.total}`
                      : `Total: ${roll.total}`}
                  </Text>
                )}
              </View>
            );
          })
        )}
      </ScrollView>
      <TouchableOpacity style={styles.clearHistoryButton} onPress={clearHistory}>
        <Text style={styles.clearHistoryText}>Clear History</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.mainScrollView}>
        <View style={styles.mainContainer}>
          <Text style={styles.title}>🎲 Dice Roller</Text>
          {renderDiceGrid()}
          {renderOptions()}
          {renderNotationInput()}
          {renderResults()}
        </View>
      </ScrollView>
      {renderHistory()}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>How many dice?</Text>
            <View style={styles.countInputGroup}>
              <Text style={styles.countLabel}>Number of dice:</Text>
              <TextInput
                style={styles.countInput}
                value={diceCount}
                onChangeText={setDiceCount}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonTextSecondary}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={handleRollDice}
              >
                <Text style={styles.modalButtonTextPrimary}>Roll</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#667eea',
  },
  mainScrollView: {
    flex: 1,
  },
  mainContainer: {
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  diceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  diceButton: {
    width: '30%',
    backgroundColor: '#764ba2',
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  diceButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  optionsSection: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 15,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#667eea',
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#667eea',
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#495057',
  },
  modifierContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modifierLabel: {
    fontSize: 16,
    color: '#495057',
    fontWeight: '500',
    marginRight: 10,
  },
  modifierInput: {
    borderWidth: 2,
    borderColor: '#667eea',
    borderRadius: 8,
    padding: 8,
    width: 100,
    textAlign: 'center',
    fontSize: 16,
  },
  notationSection: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  notationInputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notationInput: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#667eea',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginRight: 10,
    textAlign: 'center',
  },
  rollButton: {
    backgroundColor: '#f5576c',
    padding: 12,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  rollButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultsSection: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 10,
  },
  resultsLabel: {
    fontSize: 16,
    color: '#495057',
    marginBottom: 10,
  },
  resultsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  dieResult: {
    backgroundColor: '#764ba2',
    padding: 15,
    borderRadius: 10,
    margin: 5,
    minWidth: 60,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  dieResultText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  totalText: {
    fontSize: 18,
    color: '#f5576c',
    fontWeight: 'bold',
    marginTop: 10,
  },
  historyPanel: {
    backgroundColor: '#fff',
    padding: 20,
    maxHeight: 300,
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 15,
    textAlign: 'center',
  },
  historyList: {
    flex: 1,
  },
  emptyHistory: {
    textAlign: 'center',
    color: '#adb5bd',
    fontStyle: 'italic',
    padding: 20,
  },
  historyItem: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#667eea',
  },
  historyItemHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 8,
  },
  historyItemResults: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  historyDie: {
    backgroundColor: '#764ba2',
    padding: 5,
    borderRadius: 5,
    margin: 2,
  },
  historyDieText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  historyItemTotal: {
    fontSize: 14,
    color: '#f5576c',
    fontWeight: 'bold',
  },
  clearHistoryButton: {
    backgroundColor: '#f5576c',
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
    alignItems: 'center',
  },
  clearHistoryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 30,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#667eea',
    textAlign: 'center',
    marginBottom: 20,
  },
  countInputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  countLabel: {
    fontSize: 16,
    color: '#495057',
    marginRight: 10,
  },
  countInput: {
    borderWidth: 2,
    borderColor: '#667eea',
    borderRadius: 8,
    padding: 8,
    width: 80,
    textAlign: 'center',
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  modalButtonPrimary: {
    backgroundColor: '#667eea',
  },
  modalButtonSecondary: {
    backgroundColor: '#e9ecef',
  },
  modalButtonTextPrimary: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalButtonTextSecondary: {
    color: '#495057',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;
