import sys

# Check if the file path is provided
if len(sys.argv) != 2:
    print("Usage: python script.py <file_path>")
    sys.exit(1)

file_path = sys.argv[1]

# Strings to track
strings_to_track = [
    "intergenic", "upstream", "5_prime", "synonymous", "missense", "stop", "frameshift", "intron", "non_coding",  "3_prime", "downstream"
]

# Initialize counters
counters = {string: 0 for string in strings_to_track}
total_rows = 0
no_match_rows = 0

try:
    with open(file_path, 'r') as file:
        for line in file:
            total_rows += 1
            fields = line.strip().split('\t')

            # Check if the line has at least 8 columns
            if len(fields) < 8:
                continue

           # Flag to check if any string matches
            found_match = False

            # Check and count the strings in the 8th column
            for string in strings_to_track:
                if string in fields[7]:
                    counters[string] += 1
                    found_match = True

            if not found_match:
                no_match_rows += 1

except FileNotFoundError:
    print(f"File not found: {file_path}")
    sys.exit(1)

# Print the results
print("Counts:")
for string, count in counters.items():
    print(f"{string}: {count}")
print(f"Total rows: {total_rows}")
print(f"Rows with no match: {no_match_rows}")

print("\n\n")
out_string = str(total_rows)
for string, count in counters.items():
    out_string = out_string + "\t" + str(count)

out_string = out_string + "\t" + str(no_match_rows)
print(out_string)
