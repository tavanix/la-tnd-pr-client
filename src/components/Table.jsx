import { useMemo, useState } from 'react'
import {
  MRT_EditActionButtons,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table'
import {
  Box,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import EditIcon from '@mui/icons-material/Edit'

import { customFetch } from '../utils'
import authHeader from '../utils/authHeader'
import { useSelector } from 'react-redux'

// figure out
// const validateRequired = (value) => !!value.length
// const validateEmail = (email) =>
//   !!email.length &&
//   email
//     .toLowerCase()
//     .match(
//       /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
//     )

// function validateUser(user) {
//   return {
//     firstName: !validateRequired(user.firstName)
//       ? 'First Name is Required'
//       : '',
//     lastName: !validateRequired(user.lastName) ? 'Last Name is Required' : '',
//     email: !validateEmail(user.email) ? 'Incorrect Email Format' : '',
//   }
// }
// figure out end

const Table = () => {
  const employees = useSelector((state) => state.employeesState.employees)

  const [validationErrors, setValidationErrors] = useState({})

  const columns = useMemo(
    () => [
      {
        accessorKey: 'employeeId',
        header: 'Employee ID',
        enableEditing: false,
        size: 80,
      },
      {
        accessorKey: 'employeeName',
        header: 'Employee Name',
        enableEditing: false,
        size: 80,
      },
      {
        accessorKey: 'email',
        header: 'Email',
        enableEditing: false,
        size: 80,
      },
      {
        accessorKey: 'level1',
        header: 'Level 1',
        enableEditing: false,
        size: 80,
      },
      {
        accessorKey: 'level2',
        header: 'Level 2',
        enableEditing: false,
        size: 80,
      },
      {
        accessorKey: 'level3',
        header: 'Level 3',
        enableEditing: false,
        size: 80,
      },
      {
        accessorKey: 'level4',
        header: 'Level 4',
        enableEditing: false,
        size: 80,
      },
      {
        accessorKey: 'level5',
        header: 'Level 5',
        enableEditing: false,
        size: 80,
      },
      {
        accessorKey: 'startDate',
        header: 'Дата приема',
        enableEditing: false,
      },
      {
        accessorKey: 'positionEntryDate',
        header: 'В должности с',
        enableEditing: false,
      },
      {
        accessorKey: 'positionTitle',
        header: 'Должность',
        enableEditing: false,
      },
      {
        accessorKey: 'directManager',
        header: 'Руководитель',
        enableEditing: false,
      },
      {
        accessorKey: 'levelFromCeo',
        header: 'N- уровень',
        enableEditing: false,
      },
      {
        accessorKey: 'hasBonus',
        header: 'hasBonus',
        enableEditing: false,
      },
      {
        accessorKey: 'isManager',
        header: 'isManager',
        enableEditing: false,
      },
      {
        accessorKey: 'selfEvaluationPrevious',
        header: 'Самооценка H1 2024',
        enableEditing: false,
      },
      {
        accessorKey: 'selfEvaluation',
        header: 'Самооценка H2 2024',
        enableEditing: false,
      },
      {
        accessorKey: 'managerEvaluation',
        header: 'Оценка руководителя',
        enableEditing: false,
      },
      {
        accessorKey: 'managerEvaluationComment',
        header: 'Комментарий руководителя',
        enableEditing: false,
      },
      {
        accessorKey: 'calibration',
        header: 'Calibration',
        muiEditTextFieldProps: {
          required: true,
        },
      },
      {
        accessorKey: 'calibrationComment',
        header: 'Calibration Comment',
        muiEditTextFieldProps: {
          required: true,
        },
      },
      {
        accessorKey: 'feedbackPeer',
        header: 'Оценка от коллег',
        enableEditing: false,
      },
      {
        accessorKey: 'feedbackProjectsAndTasks',
        header: 'Проекты и задачи',
        enableEditing: false,
      },
      {
        accessorKey: 'feedbackCooperation',
        header: 'Взаимодействие',
        enableEditing: false,
      },
      {
        accessorKey: 'feedbackComment',
        header: 'Комментарии коллег',
        enableEditing: false,
      },
      // {
      //   accessorKey: 'employeeName',
      //   header: 'Employee Name',
      //   muiEditTextFieldProps: {
      //     required: true,
      //     error: !!validationErrors?.firstName,
      //     helperText: validationErrors?.firstName,
      //     //remove any previous validation errors when user focuses on the input
      //     onFocus: () =>
      //       setValidationErrors({
      //         ...validationErrors,
      //         firstName: undefined,
      //       }),
      //     //optionally add validation checking for onBlur or onChange
      //   },
      // },
      // {
      //   accessorKey: 'email',
      //   header: 'Email',
      //   muiEditTextFieldProps: {
      //     type: 'email',
      //     required: true,
      //     error: !!validationErrors?.email,
      //     helperText: validationErrors?.email,
      //     //remove any previous validation errors when user focuses on the input
      //     onFocus: () =>
      //       setValidationErrors({
      //         ...validationErrors,
      //         email: undefined,
      //       }),
      //   },
      // },
    ],
    [validationErrors]
  )

  //call READ hook
  const {
    data: fetchedUsers = [],
    isError: isLoadingUsersError,
    isFetching: isFetchingUsers,
    isLoading: isLoadingUsers,
  } = useGetUsers()

  //call UPDATE hook
  const { mutateAsync: updateUser, isPending: isUpdatingUser } = useUpdateUser()

  //UPDATE action
  const handleSaveUser = async ({ values, table }) => {
    // const newValidationErrors = validateUser(values)
    const newValidationErrors = []

    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors)
      return
    }

    setValidationErrors({})

    await updateUser(values)

    table.setEditingRow(null) //exit editing mode
  }

  const table = useMaterialReactTable({
    columns,
    data: fetchedUsers,
    createDisplayMode: 'modal', //default ('row', and 'custom' are also available)
    editDisplayMode: 'modal', //default ('row', 'cell', 'table', and 'custom' are also available)
    enableEditing: true,
    getRowId: (row) => row.id,
    muiToolbarAlertBannerProps: isLoadingUsersError
      ? {
          color: 'error',
          children: 'Error loading data',
        }
      : undefined,
    muiTableContainerProps: {
      sx: {
        minHeight: '500px',
      },
    },
    // onCreatingRowCancel: () => setValidationErrors({}),
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveUser,
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant='p'>Edit User</DialogTitle>
        <DialogContent
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 1,
          }}
        >
          {internalEditComponents} {/* or render custom edit components here */}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant='text' table={table} row={row} />
        </DialogActions>
      </>
    ),
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title='Edit'>
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    state: {
      isLoading: isLoadingUsers,
      isSaving: isUpdatingUser,
      showAlertBanner: isLoadingUsersError,
      showProgressBars: isFetchingUsers,
    },
  })

  return <MaterialReactTable table={table} />
}

//READ hook (get users from api)
function useGetUsers() {
  const user = useSelector((state) => state.userState.user)

  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      //send api request here
      const employees = await customFetch.get(`/employees`, {
        headers: authHeader(),
      })

      //TODO: check roles 'user.roles' and filter

      return employees.data
    },
    refetchOnWindowFocus: false,
  })
}

//UPDATE hook (put user in api)
function useUpdateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (user) => {
      console.log('update: ', user)

      //send api update request here
      //TODO: update state here as well

      await customFetch.put(`/updateEmployee`, user)
    },
    //client side optimistic update
    onMutate: (newUserInfo) => {
      queryClient.setQueryData(['employees'], (prevUsers) =>
        prevUsers?.map((prevUser) =>
          prevUser.id === newUserInfo.id ? newUserInfo : prevUser
        )
      )
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['user'] }), //refetch users after mutation
  })
}

export default Table
