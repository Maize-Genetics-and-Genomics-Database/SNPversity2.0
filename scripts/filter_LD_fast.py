import pandas as pd
import sys
import re

def main():
    input_file = sys.argv[1]
    output_file_path = sys.argv[2]

    # Initialize variables to keep track of the current maximum 'R2' and the corresponding row
    max_r2 = -1
    max_r2_row = None
    current_bp_a = None

    with open(input_file, 'r') as file, open(output_file_path, 'w') as output_file:
        is_first_line = True  # Flag to check if it's the first line
        for line in file:
            if is_first_line:
                is_first_line = False
                output_file.write(line)
                continue
            #parts = re.split(r'\t| ', line.strip())
            parts = line.strip().split()
            # Filter rows based on the conditions

            r2 = float(parts[6])
            if abs(int(parts[1]) - int(parts[4])) < 400 or r2 < 0.5 :
                continue

            # Check if we have moved to a new 'BP_A' value
            if parts[1] != current_bp_a:
                # Write the previous maximum 'R2' row to the file
                if max_r2_row is not None :
                    output_file.write(max_r2_row)

                # Reset the maximum 'R2' and current 'BP_A'
                current_bp_a = parts[1]
                max_r2 =r2
                max_r2_row = line
            else:
                # Update the maximum 'R2' if the current row has a higher value
                if r2 > max_r2 :
                    max_r2 = r2
                    max_r2_row = line

        # Write the last maximum 'R2' row to the file
        if max_r2_row is not None:
            output_file.write(max_r2_row)

if __name__ == '__main__':
    main()
