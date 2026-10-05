import heapq
import sys

# A SNP passes when at least one partner 400 bp or more away has R2 >= 0.5.
# The 5 kb upper limit comes from plink --ld-window-kb 5.
MIN_DISTANCE = 400
MIN_R2 = 0.5

def main():
    input_file = sys.argv[1]
    output_file_path = sys.argv[2]

    # For each SNP, the passing pair with the highest R2 seen so far, whether the SNP is
    # the pair's BP_A or its BP_B: best[pos] = (r2, bp_a, bp_b, line)
    best = {}
    # Positions in best, smallest first, so finished SNPs can be written in order
    pending = []
    # written[bp_b] = BP_A values whose pair was already written as that SNP's best,
    # so a pair that is the best for both of its SNPs is written once
    written = {}
    last_bp_a = -1

    with open(input_file, 'r') as file, open(output_file_path, 'w') as output_file:
        output_file.write(file.readline())  # header

        def write_finished(before):
            # plink --r2 lists pairs by ascending BP_A with BP_B after BP_A, so once BP_A
            # reaches `before`, a SNP at a smaller position cannot appear in a later row
            while pending and pending[0] < before:
                pos = heapq.heappop(pending)
                r2, bp_a, bp_b, line = best.pop(pos)
                already_written = written.pop(pos, ())
                if pos == bp_a:
                    output_file.write(line)
                    written.setdefault(bp_b, set()).add(bp_a)
                elif bp_a not in already_written:
                    output_file.write(line)

        for line_number, line in enumerate(file, start=2):
            parts = line.split()
            bp_a = int(parts[1])
            bp_b = int(parts[4])
            r2 = float(parts[6])

            if bp_a < last_bp_a or bp_b < bp_a:
                sys.exit(f"{input_file} line {line_number}: expected one chromosome of plink --r2 "
                         "output, sorted by BP_A with BP_B after BP_A")
            if bp_a != last_bp_a:
                write_finished(bp_a)
                last_bp_a = bp_a

            # "not >=" also drops pairs where plink reports nan
            if bp_b - bp_a < MIN_DISTANCE or not r2 >= MIN_R2:
                continue

            for pos in (bp_a, bp_b):
                if pos not in best:
                    heapq.heappush(pending, pos)
                    best[pos] = (r2, bp_a, bp_b, line)
                elif r2 > best[pos][0]:
                    best[pos] = (r2, bp_a, bp_b, line)

        write_finished(float('inf'))

if __name__ == '__main__':
    main()
