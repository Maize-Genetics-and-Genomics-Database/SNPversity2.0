import pandas as pd
import h5py
import sys
import numpy as np


print("Start",flush=True)

# Define the dtype for variable-length strings
str_dtype = h5py.special_dtype(vlen=str)

# Genotype encoding mapping
genotype_mapping = {"0/0": 0, "0/1": 1, "1/0": 1, "1/1": 2, "./.": 3}

vcf_file = sys.argv[1]
output_hdf5 = sys.argv[2]

chunk_size = 300000  # Adjust based on your memory constraints
#chunk_size = 2000  # Adjust based on your memory constraints
hdf5_chunk_size = (10000,)  # Example chunk size, adjust as needed
#hdf5_chunk_size = (1000,)  # Example chunk size, adjust as needed

with h5py.File(output_hdf5, 'w') as hdf5_out:
    datasets = {}
    num_rows_written = 0

    for df_chunk in pd.read_csv(vcf_file, sep='\t', chunksize=chunk_size, comment='#'):
        num_rows = df_chunk.shape[0]
        print(f"Number of rows in the chunk pre-filter: {num_rows}")

        if not datasets:
            # Initialize datasets for each column during the first chunk iteration
            for i, column in enumerate(df_chunk.columns):
                if i < 9:  # For the first 9 columns
                    dtype = str_dtype  # or appropriate data type
                else:  # For genotype columns
                    dtype = 'i1'  # 8-bit integer
                datasets[column] = hdf5_out.create_dataset(
                    column,
                    (0,),  # Start with zero rows, will be resized
                    maxshape=(None,),
                    dtype=dtype,
                    chunks=hdf5_chunk_size
                )

        # Resize datasets and write data
        for i, column in enumerate(df_chunk.columns):
            # Resize datasets to accommodate new rows
            datasets[column].resize(num_rows_written + num_rows, axis=0)
            if i >= 9:  # Genotype columns
                encoded_data = df_chunk[column].map(genotype_mapping).fillna(3).astype('i1').values
            else:  # First 9 columns
                encoded_data = df_chunk[column].astype(str).values
            datasets[column][num_rows_written:num_rows_written + num_rows] = encoded_data

        num_rows_written += num_rows
        print("Chunk: " + str(num_rows_written), flush=True)

print(f"Data saved to HDF5 file: {output_hdf5}")
