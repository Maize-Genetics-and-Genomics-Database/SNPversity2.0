import sys

# Check if the file name is provided as a command-line argument
if len(sys.argv) != 2:
    print("Usage: script.py <file.tsv>")
    sys.exit(1)

filename = sys.argv[1]

# Initialize counters
count_01_10 = 0
count_fourth_col_length = 0
count_fifth_col_length = 0
mq_30_40 = 0
mq_40_50 = 0
mq_50_60 = 0
mq_60 = 0
cvp_50_60 = 0
cvp_60_70 = 0
cvp_70_80 = 0
cvp_80_90 = 0
cvp_90_100 = 0
r2_50_60 = 0
r2_60_70 = 0
r2_70_80 = 0
r2_80_90 = 0
r2_90_100 = 0
row_count = 0

count_00 = 0
count_11 = 0
count_dot = 0
count_01 = 0
count_10 = 0

# Open the TSV file for reading
with open(filename, 'r') as file:
    for line in file:
        row_count += 1
        columns = line.strip().split('\t')

        # Check if "0/1" or "1/0" is present in the row
        if "0/1" in columns or "1/0" in columns:
            count_01_10 += 1

        # Check each column for the specific genotypes
        for col in columns:
            if col == "0/0":
                count_00 += 1
            elif col == "1/1":
                count_11 += 1
            elif col == "./.":
                count_dot += 1
            elif col == "0/1":
                count_01 += 1
            elif col == "1/0":
                count_10 += 1

        # Check the length of the fourth and fifth columns
        if len(columns) > 3 and len(columns[3]) > 1:
            count_fourth_col_length += 1
        if len(columns) > 4 and len(columns[4]) > 1:
            count_fifth_col_length += 1

        # Process the eighth column if it exists
        if len(columns) > 7:
            info_fields = columns[7].split(';')
            for field in info_fields:
                if field.startswith('MQ='):
                    mq_value = float(field.replace('MQ=', ''))
                    if 30 <= mq_value < 40:
                        mq_30_40 += 1
                    elif 40 <= mq_value < 50:
                        mq_40_50 += 1
                    elif 50 <= mq_value < 60:
                        mq_50_60 += 1
                    elif  mq_value > 60:
                        mq_60 += 1
                if field.startswith('CVP='):
                    cvp_value = float(field.replace('CVP=', ''))
                    if 50 <= cvp_value < 60:
                        cvp_50_60 += 1
                    elif 60 <= cvp_value < 70:
                        cvp_60_70 += 1
                    elif 70 <= cvp_value < 80:
                        cvp_70_80 += 1
                    elif 80 <= cvp_value < 90:
                        cvp_80_90 += 1
                    elif 90 <= cvp_value <= 100:
                        cvp_90_100 += 1
                if field.startswith('MAXR2='):
                    cvp_value = float(field.replace('MAXR2=', ''))
                    if 0.5 <= cvp_value < 0.6:
                        r2_50_60 += 1
                    elif 0.6 <= cvp_value < 0.7:
                        r2_60_70 += 1
                    elif 0.7 <= cvp_value < 0.8:
                        r2_70_80 += 1
                    elif 0.8 <= cvp_value < 0.9:
                        r2_80_90 += 1
                    elif 0.9 <= cvp_value <= 1.0:
                        r2_90_100 += 1
        # Output the counts every 500,000 records
        if row_count % 500000 == 0:
            print(f"Processed {row_count} records...", flush=True)
            # Output the intermediate counts here

# Output the final results
print(f"Processed {row_count} records...")
print(f"Total rows with '0/1' or '1/0': {count_01_10}")
print(f"Count where the fourth column has length > 1: {count_fourth_col_length}")
print(f"Count where the fifth column has length > 1: {count_fifth_col_length}")
print(f"Counts for MQ in [30, 40): {mq_30_40}")
print(f"Counts for MQ in [40, 50): {mq_40_50}")
print(f"Counts for MQ in [50, 60): {mq_50_60}")
print(f"Counts for MQ > 60: {mq_60}")
print(f"Counts for CVP in [50, 60): {cvp_50_60}")
print(f"Counts for CVP in [60, 70): {cvp_60_70}")
print(f"Counts for CVP in [70, 80): {cvp_70_80}")
print(f"Counts for CVP in [80, 90): {cvp_80_90}")
print(f"Counts for CVP in [90, 100]: {cvp_90_100}")
print(f"Counts for max R2 in [50, 60): {r2_50_60}")
print(f"Counts for max R2 in [60, 70): {r2_60_70}")
print(f"Counts for max R2 in [70, 80): {r2_70_80}")
print(f"Counts for max R2 in [80, 90): {r2_80_90}")
print(f"Counts for max R2 in [90, 100]: {r2_90_100}")
print(f"Total '0/0' count: {count_00}")
print(f"Total '1/1' count: {count_11}")
print(f"Total './.' count: {count_dot}")
print(f"Total '0/1' count: {count_01}")
print(f"Total '1/0' count: {count_10}")

hom_hits = count_00 + count_11
het_hits = count_01 + count_10
missing = count_dot

final_str = str(row_count) + "\t" + str(hom_hits) + "\t" + str(het_hits) + "\t" + str(missing) + "\t" + str(count_01_10) + "\t"
final_str = final_str + str(count_fourth_col_length) + "\t" + str(count_fifth_col_length) + "\t" + str(mq_30_40) + "\t"
final_str = final_str + str(mq_40_50) + "\t" + str(mq_50_60) + "\t" + str(mq_60) + "\t"
final_str = final_str + str(cvp_50_60) + "\t" + str(cvp_60_70) + "\t" + str(cvp_70_80) + "\t" + str(cvp_80_90) + "\t" + str(cvp_90_100) + "\t"
final_str = final_str + str(r2_50_60) + "\t" + str(r2_60_70) + "\t" + str(r2_70_80) + "\t" + str(r2_80_90) + "\t" + str(r2_90_100)

print ("\n\n")
print(final_str)
