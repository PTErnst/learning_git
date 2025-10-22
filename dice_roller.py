import random
import re

def display_menu():
    """Display the dice selection menu."""
    print("\n=== Dice Roller ===")
    print("Select a die to roll:")
    print("1. D4 (4-sided die)")
    print("2. D6 (6-sided die)")
    print("3. D8 (8-sided die)")
    print("4. D10 (10-sided die)")
    print("5. D12 (12-sided die)")
    print("6. D20 (20-sided die)")
    print("7. D100 (100-sided die)")
    print("8. Quit")
    print("\nOr enter dice notation (e.g., 2d6, 5d20)")
    print("==================")

def roll_die(sides, count=1):
    """Roll a die with the specified number of sides, multiple times."""
    return [random.randint(1, sides) for _ in range(count)]

def parse_dice_notation(notation):
    """
    Parse dice notation like '2d6' or '5d20'.
    Returns tuple of (count, sides) or None if invalid.
    """
    match = re.match(r'^(\d+)d(\d+)$', notation.lower().strip())
    if match:
        count = int(match.group(1))
        sides = int(match.group(2))
        if count > 0 and sides > 0:
            return (count, sides)
    return None

def display_roll_results(die_name, count, results):
    """Display the results of a dice roll."""
    total = sum(results)
    print(f"\n🎲 Rolling {count}x {die_name}...")
    print(f"Results: {results}")
    if count > 1:
        print(f"Total: {total}")

def main():
    """Main function to run the dice roller app."""
    dice_types = {
        '1': ('D4', 4),
        '2': ('D6', 6),
        '3': ('D8', 8),
        '4': ('D10', 10),
        '5': ('D12', 12),
        '6': ('D20', 20),
        '7': ('D100', 100)
    }

    while True:
        display_menu()
        choice = input("\nEnter your choice (1-8) or dice notation: ").strip()

        if choice == '8':
            print("\nThanks for playing! Goodbye!")
            break

        # Check if input is dice notation (e.g., 2d6, 5d20)
        dice_notation = parse_dice_notation(choice)
        if dice_notation:
            count, sides = dice_notation
            die_name = f"D{sides}"
            results = roll_die(sides, count)
            display_roll_results(die_name, count, results)
            input("\nPress Enter to continue...")
        elif choice in dice_types:
            die_name, sides = dice_types[choice]

            # Ask how many dice to roll
            while True:
                try:
                    count = input(f"\nHow many {die_name} dice do you want to roll? ").strip()
                    count = int(count)
                    if count < 1:
                        print("❌ Please enter a positive number.")
                        continue
                    break
                except ValueError:
                    print("❌ Please enter a valid number.")

            results = roll_die(sides, count)
            display_roll_results(die_name, count, results)
            input("\nPress Enter to continue...")
        else:
            print("\n❌ Invalid choice! Please select a number between 1 and 8 or use dice notation (e.g., 2d6).")
            input("\nPress Enter to continue...")

if __name__ == "__main__":
    main()
